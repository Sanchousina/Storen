import * as express from 'express';
import DB from '../db/index.js';
import multer from 'multer';
import { sendToS3, deleteFromS3, getS3Url, randomName } from '../helpers/s3Client.js';
import { verifyToken } from '../middleware/jwt.js';
import { ROLES_LIST, verifyAdvertPermissions, verifyRole } from '../middleware/verifyRole.js';

const IMG_FOLDER = 'imgs/';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/adverts/:advertId/images', async (req, res) => {
    try{
        let images = await DB.gallery.all(req.params.advertId);
        for (const image of images){
            image.image_url = await getS3Url(image.image_name);
        }
        res.json(images);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/adverts/:advertId/images',
    [verifyToken,
    verifyRole([ROLES_LIST[0], ROLES_LIST[2]]),
    verifyAdvertPermissions,
    upload.array('images', 10)],
    async (req, res) => {
        for(const file of req.files){
            const fileName = IMG_FOLDER + randomName();
            sendToS3(file, fileName);
            try{
                await DB.gallery.insert(req.params.advertId, fileName);
            }catch(err){
                console.log(err);
                res.sendStatus(500);
            }
        }
        res.sendStatus(200);
});

router.delete('/adverts/:advertId/images', 
    [verifyToken,
    verifyRole([ROLES_LIST[0], ROLES_LIST[2]]),
    verifyAdvertPermissions],
    async(req, res) => {
    try{
        let images = await DB.gallery.all(req.params.advertId);
        for(const image of images){
            const image_name = image.image_name;
            await deleteFromS3(image_name);
        }

        await DB.gallery.deleteAll(req.params.advertId);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/adverts/:advertId/images/:imageId', 
    [verifyToken,
    verifyRole([ROLES_LIST[0], ROLES_LIST[2]]),
    verifyAdvertPermissions],
    async(req, res) => {
    const imageId = req.params.imageId;
    try{
        const image = await DB.gallery.one(imageId);
        const image_name = image.image_name;
        await deleteFromS3(image_name);

        await DB.gallery.deleteOne(imageId);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;