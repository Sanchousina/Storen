import * as express from 'express';
import DB from '../db/index.js';

const router = express.Router();

//TODO:
// router.get('/:user_id/favorite', async (req, res) => {
//     const user_id = req.params.user_id;

//     try{

//     }catch(err){
//         console.log(err);
//         res.sendStatus(500);
//     }
// });

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