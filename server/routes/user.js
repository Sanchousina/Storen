import * as express from 'express';
import DB from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        let users = await DB.user.all();
        res.json(users);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/:id', async(req, res) => {
    try{
        let user = await DB.user.one(req.params.id);
        res.json(user);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

export default router;

