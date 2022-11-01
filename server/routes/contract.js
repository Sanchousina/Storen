import * as express from 'express';
import DB from '../db/index.js'

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
})

export default router;