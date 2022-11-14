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
});

router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone = req.body.phone;
    const company = req.body.company;

    try{
        const newUserId = await DB.user.register(
            [email, password, first_name, last_name, phone, company]
        )
        res.json(newUserId);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;

