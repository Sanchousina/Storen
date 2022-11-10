import * as express from 'express';
import DB from '../db/index.js';
import { s3 } from '../helpers/s3Client.js';
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';

const router = express.Router();

router.get('/:advert_id/images', async (req, res) => {
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

export default router;