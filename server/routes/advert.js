import * as express from 'express';
import DB from '../db/index.js';
import { validateRequest } from '../middleware/validate_request.js';
import { advertSchema } from '../schemas/advert_schema.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        let adverts = await DB.advert.all();
        res.json(adverts);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try{
        let advert = await DB.advert.one(req.params.id);
        res.json(advert);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/create', 
    advertSchema, 
    validateRequest,
    async (req, res) => {
    const warehouse_id = req.body.warehouse_id;
    const user_id = req.body.user_id;
    const creation_date = req.body.creation_date;
    const rental_rate = req.body.rental_rate;
    const description = req.body.description;
    const document_url = req.body.original_document_url;

    try{
        let newAdvertId = await DB.advert.createNew(
            [warehouse_id, user_id, creation_date, rental_rate, description, document_url]
        );
        res.status(201).json(newAdvertId);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/update/:id', 
    advertSchema, 
    validateRequest, 
    async (req, res) => {
    const id = req.params.id;
    const rental_rate = req.body.rental_rate;
    const description = req.body.description;

    try{
        await DB.advert.update([rental_rate, description, id]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

export default router;
