import * as express from 'express';
import DB from '../db/index.js';
import { warehouseSchema } from '../schemas/warehouse_schema.js';
import { validateRequest } from '../middleware/validate_request.js';
import { verifyToken } from '../middleware/jwt.js';
import { ROLES_LIST, verifyAdvertPermissions, verifyRole } from '../middleware/verifyRole.js';

const router = express.Router();
router.use(express.json());

router.get('/:advertId', async (req, res) => {
    try{
        let warehouse = await DB.warehouse.one(req.params.advertId);
        res.json(warehouse[0]);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/:advertId',
    [verifyToken,
    verifyRole([ROLES_LIST[0], ROLES_LIST[2]]),
    verifyAdvertPermissions,
    warehouseSchema,
    validateRequest],
    async (req, res) => {
    const advertId = req.params.advertId;
    const attributes = getAttributes(req);

    try{
        let newWarehouseId = await DB.warehouse.createNew([advertId, ...attributes]);
        res.status(201).json(newWarehouseId);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:warehouseId/AC', async(req, res) => {
    const currentTemperature = req.query.temp;
    const currentHumidity = req.query.humidity;

    try{
        await DB.warehouse.updateTempAndHumidity(
            currentTemperature, currentHumidity, req.params.warehouseId
        )
        const requiredTemperature = await DB.warehouse.getRequiredTemp(req.params.warehouseId);

        let command = currentTemperature > requiredTemperature ? 
                    "Turn on AC colder": 
                    currentTemperature < requiredTemperature ? 
                    "Turn on AC warmer": 
                    "Temperature is OK";

        res.json({
            command: command
        });
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:advertId',
    [verifyToken,
    verifyRole([ROLES_LIST[0], ROLES_LIST[2]]),
    verifyAdvertPermissions,
    warehouseSchema,
    validateRequest],
    async (req, res) => {
    const advertId = req.params.advertId;
    const attributes = getAttributes(req);

    try{
        await DB.warehouse.update([...attributes, advertId]);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

function getAttributes(req){
    let attributes = [];

    const city = req.body.city;
    attributes.push(city);
    const street = req.body.street;
    attributes.push(street);
    const house_num = req.body.house_num;
    attributes.push(house_num);
    const zip = req.body.zip;
    attributes.push(zip);
    const type = req.body.type;
    attributes.push(type );
    const available_space = req.body.available_space;
    attributes.push(available_space);
    const total_space = req.body.total_space;
    attributes.push(total_space);
    const seiling_height = req.body.seiling_height;
    attributes.push(seiling_height);
    const temperature = req.body.temperature;
    attributes.push(temperature);
    const humidity = req.body.humidity;
    attributes.push(humidity);
    const year_built = req.body.year_built;
    attributes.push(year_built );
    const parking_slots = req.body.parking_slots;
    attributes.push(parking_slots);
    const use_machinery = req.body.use_machinery;
    attributes.push(use_machinery);

    return attributes;
}

export default router;