import * as express from 'express';
import multer from 'multer';
import DB from '../db/index.js';
import { validateRequest } from '../middleware/validate_request.js';
import { advertSchema } from '../schemas/advert_schema.js';
import getCurrentDate from '../helpers/currentDate.js';
import { s3, sendToS3, deleteFromS3, randomName } from '../helpers/s3Client.js';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';


dotenv.config();

const DOCS_FOLDER = 'docs/';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/', async (req, res) => {
    try{
        let adverts = await DB.advert.all();

        for (const advert of adverts){
            const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: advert.image_name,
            }
            const cmd = new GetObjectCommand(getObjectParams);
            let url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
            advert.image_url = url;
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

        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: advert.document_name,
        }
        const cmd = new GetObjectCommand(getObjectParams);
        let url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
        advert.document_url = url;

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
    
    const fileName = DOCS_FOLDER + randomName();
    sendToS3(req.file, fileName);

    const document_name = fileName;
    const creation_date = getCurrentDate();

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
