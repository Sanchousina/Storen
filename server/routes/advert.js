import * as express from 'express';
import DB from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        let adverts = DB.advert.all();
        res.json(adverts);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;
