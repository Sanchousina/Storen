import { body } from 'express-validator';

export const contractSchema = [
    body("initial_date")
        .exists({checkFalsy: true})
        .withMessage("Initial date should not be null")
        .isDate({format: "YYYY-MM-DD"})
        .withMessage("Initial date should be date"),
    body("expiry_date")
        .exists({checkFalsy: true})
        .withMessage("Expiry date should not be null")
        .isDate({format: "YYYY-MM-DD"})
        .withMessage("Expiry date should be date"),
    body("space_size")
        .exists({checkFalsy: true})
        .withMessage("Space size should not be null")
        .isNumeric()
        .withMessage("Space size should be numeric"),
    body("contract_url")
        .exists({checkFalsy: true})
        .withMessage("Contract should not be null")
        .isString()
        .withMessage("Contract should be string"),
    body("status")
        .exists({checkFalsy: true})
        .withMessage("Status should not be null")
        .isIn(['pending','accepted','rejected'])
        .withMessage("Status should one of the offered values")
];