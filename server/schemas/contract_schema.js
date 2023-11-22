import { body } from 'express-validator';

export const contractSchema = [
    body("initialDate")
        .exists({checkFalsy: true})
        .withMessage("Initial date should not be null")
        .isDate({format: "YYYY-MM-DD"})
        .withMessage("Initial date should be date"),
    body("expiryDate")
        .exists({checkFalsy: true})
        .withMessage("Expiry date should not be null")
        .isDate({format: "YYYY-MM-DD"})
        .withMessage("Expiry date should be date"),
    body("spaceSize")
        .exists({checkFalsy: true})
        .withMessage("Space size should not be null")
        .isNumeric()
        .withMessage("Space size should be numeric"),
];