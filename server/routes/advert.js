import * as express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { connection } from '../db/index.js';
import DB from '../db/index.js';
import { validateRequest } from '../middleware/validate_request.js';
import { advertSchema } from '../schemas/advert_schema.js';
import getCurrentDate from '../helpers/currentDate.js';
import { sendToS3, deleteFromS3, getS3Url, randomName } from '../helpers/s3Client.js';
import { verifyToken } from '../middleware/jwt.js';
import { ROLES_LIST, verifyRole, verifyAdvertPermissions } from '../middleware/verifyRole.js';

dotenv.config();

const DOCS_FOLDER = 'docs/';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/', async (req, res) => {
    const source = req.query.source;
    try{
        let adverts;
        if(source == 'searchbar'){
            const city = req.query.city;
            adverts = city ? 
                await DB.advert.allByCity(city) 
                : await DB.advert.all();
        }else if(source == 'filter'){
            const whereSql = await filterSQL(req);
            const sortSql = sortSQL(req);
            adverts = await DB.advert.all(whereSql, sortSql);
        }else{
            adverts = await DB.advert.all();
        }
        for (const advert of adverts){
            advert.image_url = await getS3Url(advert.image_name);
        }
        res.json(adverts);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

const sortSQL = (req) => {
    const sortBy = req.query.sortby;
    const direction = req.query.direction ? req.query.direction: 'asc';
    let sql = ``;
    if(sortBy != undefined){
        sql += `ORDER BY ${sortBy} ${direction}`;
    }

    return sql;
}

const filterSQL = async (req) => {
    const enumType = await DB.warehouse.getTypes();
    
    const city = req.query.city ? connection.escape(req.query.city) : 'all';
    const zip = req.query.zip ? connection.escape(req.query.zip) : 'all';
    const type = req.query.type ? req.query.type.split(',') : enumType;
    const avspacemin = req.query.avspacemin;
    const avspacemax = req.query.avspacemax;
    const tmin = req.query.tmin;
    const tmax = req.query.tmax;
    const parkslotsmin = req.query.parkslotsmin;
    const parkslotsmax = req.query.parkslotsmax;
    const machinery = req.query.machinery;
    const rentratemin = req.query.rentratemin;
    const rentratemax = req.query.rentratemax;

    let typeString = ``;
    for (let i = 0; i < type.length; i++){
        typeString += (i == type.length - 1)? `'${type[i]}'` : `'${type[i]}', `;
    }

    const sql = `
        WHERE city = IF ('${city}' = 'all', city, '${city}')
        AND zip = IF ('${zip}' = 'all', zip, '${zip}')
        AND type IN (${typeString})
        ${
            avspacemin && avspacemax ? 
            `AND available_space BETWEEN ${avspacemin} and ${avspacemax}` 
            : ``
        }
        ${
            tmin && tmax ?
            `AND temperature BETWEEN ${tmin} and ${tmax}` : ``
        }
        ${
            parkslotsmin && parkslotsmax ?
            `AND parking_slots BETWEEN ${parkslotsmin} and ${parkslotsmax}` 
            : ``
        }
        ${
            rentratemin && rentratemax ?
            `AND rental_rate BETWEEN ${rentratemin} and ${rentratemax}` 
            : ``
        }
        ${
            machinery ? `AND use_machinery = ${machinery}` : ``
        }`;
    
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
    [verifyToken,
    verifyRole([ROLES_LIST[0], ROLES_LIST[2]]),
    upload.single('file'),
    advertSchema, 
    validateRequest],
    async (req, res) => {
    const user_id = req.userId;
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

router.put('/:advertId', 
    [verifyToken,
    verifyRole([ROLES_LIST[2]]),
    verifyAdvertPermissions,
    advertSchema, 
    validateRequest], 
    async (req, res) => {
    const advertId = req.params.advertId;
    const rentalRate = req.body.rentalRate;
    const description = req.body.description;
    const title = req.body.title;

    try{
        await DB.advert.update([rentalRate, description, title, advertId]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/:advertId/statistics', async(req, res) => {
    const advertId = req.params.advertId;
    try{
        const advertStatistics = await DB.advert.getStatistics(advertId);
        res.json(advertStatistics);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/:advertId',
    [verifyToken,
    verifyRole([ROLES_LIST[0], ROLES_LIST[2]]),
    verifyAdvertPermissions],
    async(req, res) => {
    const advertId = req.params.advertId;
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
