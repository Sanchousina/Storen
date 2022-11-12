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
    const city = req.query.city;
    try{
        let adverts;
        if(city === undefined){
            adverts = await DB.advert.all();
        }else{
            adverts = await DB.advert.allByCity(city);
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
