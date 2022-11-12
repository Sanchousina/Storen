import * as express from 'express';
import DB from '../db/index.js'
import { contractSchema } from '../schemas/contract_schema.js';
import { validateRequest } from '../middleware/validate_request.js';
import multer from 'multer';
import { sendToS3, deleteFromS3, getS3Url, randomName } from '../helpers/s3Client.js';

const DOCS_FOLDER = 'docs/';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/users/:user_id/contracts', async (req, res) => {
    const user_id = req.params.user_id;
    const status = req.query.status;

    try{
        let contracts;
        if(status === undefined){
            contracts = await DB.contract.all(user_id);
        }else{
            contracts = await DB.contract.allByStatus(user_id, status);
        }
        for(const contract of contracts){
            contract.contract_url = await getS3Url(contract.contract_name);
        }
        res.status(200).json(contracts);
    }catch(err){
        res.sendStatus(500);
    }
});

router.get('/contracts/:contract_id', async (req, res) => {
    const contract_id = req.params.contract_id;

    try{
        let contract = await DB.contract.one(contract_id);
        contract.contract_url = await getS3Url(contract.contract_name);
        res.status(200).json(contract);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/users/:user_id/contracts',
    [upload.single('file'),
    contractSchema,
    validateRequest],
    async (req, res) => {
    const user_id = req.params.user_id;
    const warehouse_id = req.body.warehouse_id;
    const initial_date = req.body.initial_date;
    const expiry_date = req.body.expiry_date;
    const space_size = req.body.space_size;

    const contract_name = DOCS_FOLDER + randomName();
    await sendToS3(req.file, contract_name);
    
    try{
        let newContractId = await DB.contract.createNew(
            [user_id, warehouse_id, initial_date, expiry_date, space_size, contract_name]
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

//THINK ABOUT: REWRITE FILE OR ADD NEW FILE?
router.put('/contracts/:contract_id/accept',
    upload.single('file'), 
    async (req, res) => {
    const contract_id = req.params.contract_id;
    if(req.file != undefined){
        try{
            const contractInfo = await DB.contract.getContractInfo(contract_id);
            await sendToS3(req.file, contractInfo.contract_name);
            await DB.warehouse.updateAvailableSpace(contractInfo.space_size, contractInfo.warehouse_id);
            await DB.contract.accept(contract_id);
            res.sendStatus(200);
        }catch(err){
            console.log(err);
            res.sendStatus(500);
        }
    }else{
        res.sendStatus(400);
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