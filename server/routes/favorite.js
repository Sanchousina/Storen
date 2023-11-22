import * as express from 'express';
import DB from '../db/index.js';
import { getS3Url } from '../helpers/s3Client.js';
import { verifyToken } from '../middleware/jwt.js';
import { verifyUserByID } from '../middleware/verifyRole.js';

const router = express.Router();

router.get('/:userId/favorite', 
    verifyToken,
    verifyUserByID,
    async (req, res) => {
    const userId = req.params.userId;
    try{
        const favorites = await DB.favorite.all(userId);
        for (const fav of favorites){
            fav.image_url = await getS3Url(fav.image_name);
        }
        res.json(favorites);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/:userId/favorite/:advertId', 
    verifyToken,
    verifyUserByID,
    async (req, res) => {
    const userId = req.params.userId;
    const advertId = req.params.advertId;
    try{
        const isFavorite = await DB.favorite.checkIfFavorite(advertId, userId);
        res.json({"isFavorite" : isFavorite == 1? true: false});
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/:userId/favorite/adverts/:advertId',
    verifyToken,
    verifyUserByID,
    async (req, res) => {
    const advertId = req.params.advertId;
    const userId = req.params.userId;
    try{
        await DB.favorite.toFavorite(advertId, userId);
        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/:userId/favorite/adverts/:advertId', 
    verifyToken,
    verifyUserByID,
    async (req, res) => {
    const advertId = req.params.advertId;
    const userId = req.params.userId;
    try{
        await DB.favorite.unFavorite(advertId, userId);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;