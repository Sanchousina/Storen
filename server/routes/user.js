import * as express from 'express';
import bcrypt from "bcrypt";
import DB from '../db/index.js';
import { createAccessToken } from '../middleware/jwt.js';

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

    bcrypt.hash(password, 10, async (err, hash) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        try{
            const newUserId = await DB.user.register(
                [email, hash, first_name, last_name, phone, company]
            )
            res.json(newUserId);
        }catch(err){
            console.log(err);
            res.sendStatus(500);
        }
    });
});

router.post('/login', async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    try{
        const user = await DB.user.findUserByEmail(email);
        if(!user) return res.status(400).json({ error: "User doesn't exists" });

        const hashPassword = user.password;
        const match = await bcrypt.compare(password, hashPassword);
        if(!match) {
            console.log('Match: ', match);
            res.status(400).json({ error: "Wrong email and password combination" });
            return;
        }

        const accessToken = createAccessToken(user);
        res.cookie('access-token', accessToken, {
            maxAge: 30*1000,
            httpOnly: true
        });
        res.json("User exists");
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;

