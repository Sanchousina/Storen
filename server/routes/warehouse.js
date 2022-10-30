import * as express from 'express';
import DB from '../db/index.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try{
        let warehouse = await DB.warehouse.one(req.params.id);
        res.json(warehouse[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;