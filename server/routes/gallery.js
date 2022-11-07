import * as express from 'express';
import DB from '../db/index.js';

const router = express.Router();

router.get('/:advert_id/images', async (req, res) => {
    try{
        let images = await DB.gallery.all(req.params.advert_id);
        res.json(images);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;