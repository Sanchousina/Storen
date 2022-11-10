import * as express from 'express';
import DB from '../db/index.js';
import multer from 'multer';
import { s3, sendToS3, deleteFromS3, randomName } from '../helpers/s3Client.js';
import { GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const IMG_FOLDER = 'imgs/';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/adverts/:advert_id/images', async (req, res) => {
    try{
        let images = await DB.gallery.all(req.params.advert_id);

        for (const image of images){
            const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: image.image_name,
            }
            const cmd = new GetObjectCommand(getObjectParams);
            let url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
            image.image_url = url;
        }

        res.json(images);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/adverts/:advert_id/images', 
    upload.array('images', 10),
    async (req, res) => {

        for(const file of req.files){
            const fileName = IMG_FOLDER + randomName();
            sendToS3(file, fileName);
            try{
                await DB.gallery.insert(req.params.advert_id, fileName);
            }catch(err){
                console.log(err);
                res.sendStatus(500);
            }
        }

        res.sendStatus(200);
});

router.delete('/adverts/:advert_id/images', async(req, res) => {
    try{
        let images = await DB.gallery.all(req.params.advert_id);
        for(const image of images){
            const image_name = image.image_name;
            await deleteFromS3(image_name);
        }

        await DB.gallery.deleteAll(req.params.advert_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/images/:image_id', async(req, res) => {
    try{
        const image = await DB.gallery.one(req.params.image_id);
        const image_name = image.image_name;
        await deleteFromS3(image_name);

        await DB.gallery.deleteOne(req.params.image_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;