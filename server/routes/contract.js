import * as express from 'express';
import DB from '../db/index.js'
import { contractSchema } from '../schemas/contract_schema.js';
import { validateRequest } from '../middleware/validate_request.js';

const router = express.Router();

router.get('/:user_id/contracts', async (req, res) => {
    const user_id = req.params.user_id;

    try{
        let contracts = await DB.contract.all(user_id);
        res.status(200).json(contracts);
    }catch(err){
        res.sendStatus(500);
    }
});

router.get('/:user_id/contracts/:contract_id', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        let contract = await DB.contract.one(contract_id);
        res.status(200).json(contract);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/:user_id/contracts/create', 
    contractSchema,
    validateRequest,
    async (req, res) => {
    const user_id = req.params.user_id;
    const warehouse_id = req.body.warehouse_id;
    const initial_date = req.body.initial_date;
    const expiry_date = req.body.expiry_date;
    const space_size = req.body.space_size;
    const contract_url = req.body.contract_url;
    const status = req.body.status;
    
    try{
        let newContractId = await DB.contract.createNew(
            [user_id, warehouse_id, initial_date, expiry_date, space_size, contract_url, status]
        );
        res.status(201).json(newContractId);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:user_id/contracts/:contract_id/reject', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        await DB.contract.reject(contract_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/:user_id/contracts/:contract_id/delete', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        await DB.contract.deleteOne(contract_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;