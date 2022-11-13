import * as express from 'express';
import multer from 'multer';
import DB from '../db/index.js';
import { validateRequest } from '../middleware/validate_request.js';
import { advertSchema } from '../schemas/advert_schema.js';
import getCurrentDate from '../helpers/currentDate.js';
import { sendToS3, deleteFromS3, getS3Url, randomName } from '../helpers/s3Client.js';
import dotenv from 'dotenv';

dotenv.config();

const DOCS_FOLDER = 'docs/';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/', async (req, res) => {
    const sql = await filterSql(req);
    console.log(sql);
    //res.json({});
    //const city = req.query.city;
    try{
        // let adverts;
        // if(city === undefined){
        //     adverts = await DB.advert.all();
        // }else{
        //     adverts = await DB.advert.allByCity(city);
        // }
        let adverts = await DB.advert.all(sql);
        for (const advert of adverts){
            advert.image_url = await getS3Url(advert.image_name);
        }
        res.json(adverts);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

const filterSql = async (req) => {
    const enumType = await DB.warehouse.getTypes();
    const city = req.query.city ? req.query.city : 'all';
    const zip = req.query.zip ? req.query.zip : 'all';
    const type = req.query.type ? req.query.type.split(',') : enumType;
    const avspacemin = req.query.avspacemin ? req.query.avspacemin : 0;
    const avspacemax = req.query.avspacemax ? req.query.avspacemax : 1000;
    const tmin = req.query.tmin ? req.query.tmin : 0;
    const tmax = req.query.tmax ? req.query.tmax : 20;
    const parkslotsmin = req.query.parkslotsmin ? req.query.parkslotsmin : 0;
    const parkslotsmax = req.query.parkslotsmax ? req.query.parkslotsmax : 100;
    const machinery = req.query.machinery ? req.quey.machinery : 'all';
    const rentratemin = req.query.rentratemin ? req.query.rentratemin : 0;
    const rentratemax = req.query.rentratemax ? req.query.rentratemax : 10;
    let typeString = ``;
    for (let i = 0; i < type.length; i++){
        typeString += (i == type.length - 1)? `'${type[i]}'` : `'${type[i]}', `;
    }
    const sql = `
        WHERE city = IF ('${city}' = 'all', city, '${city}')
        AND zip = IF ('${zip}' = 'all', zip, '${zip}')
        AND type IN (${typeString})
        AND available_space BETWEEN ${avspacemin} and ${avspacemax}
        AND temperature BETWEEN ${tmin} and ${tmax}
        AND parking_slots BETWEEN ${parkslotsmin} and ${parkslotsmax}
        AND use_machinery = if ('${machinery}' = 'all', use_machinery, '${machinery}')
        AND rental_rate BETWEEN ${rentratemin} and ${rentratemax} `;
    return sql;
}

router.get('/:id', async (req, res) => {
    try{
        let advert = await DB.advert.one(req.params.id);
        advert.document_url = await getS3Url(advert.document_name);
        res.json(advert);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/',
    [upload.single('file'),
    advertSchema, 
    validateRequest],
    async (req, res) => {
    const user_id = req.body.user_id;
    const rental_rate = req.body.rental_rate;
    const description = req.body.description;
    const title = req.body.title;
    const creation_date = getCurrentDate();
    
    const document_name = DOCS_FOLDER + randomName();
    sendToS3(req.file, document_name);

    try{
        let newAdvertId = await DB.advert.createNew(
            [user_id, creation_date, rental_rate, description, document_name, title]
        );
        res.status(201).json(newAdvertId);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:id', 
    advertSchema, 
    validateRequest, 
    async (req, res) => {
    const id = req.params.id;
    const rental_rate = req.body.rental_rate;
    const description = req.body.description;
    const title = req.body.title;

    try{
        await DB.advert.update([rental_rate, description, title, id]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/:id', async(req, res) => {
    const advertId = req.params.id;
   
    try{
        const doc_name = await DB.advert.getDoc(advertId);
        await deleteFromS3(doc_name);

        await DB.advert.deleteOne(advertId);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;
