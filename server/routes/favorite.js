import * as express from 'express';
import DB from '../db/index.js';
import { getS3Url } from '../helpers/s3Client.js';

const router = express.Router();

router.get('/:user_id/favorite', async (req, res) => {
    const user_id = req.params.user_id;
    try{
        const favorites = await DB.favorite.all(user_id);
        for (const fav of favorites){
            fav.image_url = await getS3Url(fav.image_name);
        }
        res.json(favorites);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/:user_id/favorite/adverts/:advert_id', async (req, res) => {
    const advert_id = req.params.advert_id;
    const user_id = req.params.user_id;
    try{
        await DB.favorite.toFavorite(advert_id, user_id);
        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/:user_id/unfavorite/adverts/:advert_id', async (req, res) => {
    const advert_id = req.params.advert_id;
    const user_id = req.params.user_id;
    try{
        await DB.favorite.unFavorite(advert_id, user_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;