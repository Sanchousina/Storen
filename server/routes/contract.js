import * as express from 'express';
import DB from '../db/index.js'
import { contractSchema } from '../schemas/contract_schema.js';
import { validateRequest } from '../middleware/validate_request.js';
import multer from 'multer';
import { sendToS3, deleteFromS3, getS3Url, randomName } from '../helpers/s3Client.js';
import { verifyToken } from '../middleware/jwt.js';
import { ROLES_LIST, verifyAdvertOwnerContractResponse, verifyContractPermissions, verifyRole, verifyUserByID } from '../middleware/verifyRole.js';

const DOCS_FOLDER = 'docs/';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/users/:userId/contracts',
    verifyToken,
    verifyUserByID,
    async (req, res) => {
    const userId = req.params.userId;
    const status = req.query.status;

    try{
        let contracts;
        if(status === undefined){
            contracts = await DB.contract.all(userId);
        }else{
            contracts = await DB.contract.allByStatus(userId, status);
        }
        for(const contract of contracts){
            contract.contract_url = await getS3Url(contract.contract_name);
        }
        res.status(200).json(contracts);
    }catch(err){
        res.sendStatus(500);
    }
});

router.get('/contracts/:contractId',
    verifyToken,
    verifyContractPermissions,
    async (req, res) => {
    const contractId = req.params.contractId;

    try{
        let contract = await DB.contract.one(contractId);
        contract.contract_url = await getS3Url(contract.contract_name);
        res.status(200).json(contract);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/users/:userId/contracts',
    [verifyToken,
    verifyUserByID,
    upload.single('file'),
    contractSchema,
    validateRequest],
    async (req, res) => {
    const userId = req.params.userId;
    const warehouseId = req.body.warehouse_id;
    const initialDate = req.body.initial_date;
    const expiryDate = req.body.expiry_date;
    const spaceSize = req.body.space_size;

    const contractName = DOCS_FOLDER + randomName();
    await sendToS3(req.file, contractName);
    
    try{
        let newContractId = await DB.contract.createNew(
            [userId, warehouseId, initialDate, expiryDate, spaceSize, contractName]
        );
        res.status(201).json(newContractId);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/contracts/:contractId/reject', 
    verifyToken,
    verifyRole([ROLES_LIST[2]]),
    verifyAdvertOwnerContractResponse,
    async (req, res) => {
    const contractId = req.params.contractId;

    try{
        await DB.contract.reject(contractId);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/contracts/:contractId/accept',
    [verifyToken,
    verifyRole([ROLES_LIST[2]]),
    verifyAdvertOwnerContractResponse,
    upload.single('file')], 
    async (req, res) => {
    const contractId = req.params.contractId;
    if(req.file != undefined){
        try{
            const contractInfo = await DB.contract.getContractInfo(contractId);
            await sendToS3(req.file, contractInfo.contract_name);
            await DB.warehouse.updateAvailableSpace(contractInfo.space_size, contractInfo.warehouse_id);
            await DB.contract.accept(contractId);
            res.sendStatus(200);
        }catch(err){
            console.log(err);
            res.sendStatus(500);
        }
    }else{
        res.sendStatus(400);
    }
});

router.delete('/contracts/:contractId',
    verifyToken,
    verifyContractPermissions,
    async (req, res) => {
    const contractId = req.params.contractId;

    try{
        const contractInfo = await DB.contract.getContractInfo(contractId);
        await deleteFromS3(contractInfo.contract_name);

        await DB.contract.deleteOne(contractId);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

export default router;