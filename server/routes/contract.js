import * as express from 'express';
import DB from '../db/index.js'
import { contractSchema } from '../schemas/contract_schema.js';
import { validateRequest } from '../middleware/validate_request.js';
import multer from 'multer';
import { s3, sendToS3, deleteFromS3, randomName } from '../helpers/s3Client.js';
import { GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = express.Router();

router.get('/users/:user_id/contracts', async (req, res) => {
    const user_id = req.params.user_id;

    try{
        let contracts = await DB.contract.all(user_id);
        res.status(200).json(contracts);
    }catch(err){
        res.sendStatus(500);
    }
});

router.get('/users/:user_id/contracts/accepted', async (req, res) => {
    const user_id = req.params.user_id;

    try{
        let contracts = await DB.contract.allByStatus(user_id, "accepted");
        res.status(200).json(contracts);
    }catch(err){
        res.sendStatus(500);
    }
});

router.get('/users/:user_id/contracts/rejected', async (req, res) => {
    const user_id = req.params.user_id;

    try{
        let contracts = await DB.contract.allByStatus(user_id, "rejected");
        res.status(200).json(contracts);
    }catch(err){
        res.sendStatus(500);
    }
});

router.get('/users/:user_id/contracts/pending', async (req, res) => {
    const user_id = req.params.user_id;

    try{
        let contracts = await DB.contract.allByStatus(user_id, "pending");
        res.status(200).json(contracts);
    }catch(err){
        res.sendStatus(500);
    }
});


router.get('/contracts/:contract_id', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        let contract = await DB.contract.one(contract_id);
        res.status(200).json(contract);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/:user_id/contracts', 
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

router.put('/contracts/:contract_id/reject', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        await DB.contract.reject(contract_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/contracts/:contract_id/accept', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        await DB.contract.accept(contract_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete('/contracts/:contract_id', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        const contract_name = await DB.contract.getContract(contract_id);
        await deleteFromS3(contract_name);
        
        await DB.contract.deleteOne(contract_id);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;