import { body } from 'express-validator';

export const warehouseSchema = [
    body("city")
        .exists({checkFalsy: true})
        .withMessage("City should not be null")
        .isString()
        .withMessage("City should be string")
        .trim()
        .escape(),
    body("street")
        .exists({checkFalsy: true})
        .withMessage("Street should not be null")
        .isString()
        .withMessage("Street should be string")
        .trim()
        .escape(),
    body("house_num")
        .exists({checkFalsy: true})
        .withMessage("House number should not be null")
        .isNumeric()
        .withMessage("House number should be numeric"),
    body("zip")
        .exists()
        .withMessage("zip can be null, but should exists")
        .isNumeric()
        .withMessage("zip should numeric"),
    body("type")
        .exists()
        .withMessage("type can be null, but should exists")
        .isIn(["Distribution centre", "Public", "Bonded", 
        "Smart", "Consolidated", "Climate-controlled", "Personal use", "Government"])
        .withMessage("type should be on of the offered values"),
    body("available_space")
        .exists()
        .withMessage("available space can be null, but should exists")
        .isNumeric()
        .withMessage("available space should be numeric"),
    body("total_space")
        .exists({checkFalsy: true})
        .withMessage("total space should be not null")
        .isNumeric()
        .withMessage("total space space should be numeric"),
    body("seiling_height")
        .exists({checkFalsy: true})
        .withMessage("seiling height should be not null")
        .isNumeric()
        .withMessage("seiling height should be numeric"),
    body("temperature")
        .exists({checkFalsy: true})
        .withMessage("temperature should be not null")
        .isNumeric()
        .withMessage("temperature should be numeric"),
    body("humidity")
        .exists({checkFalsy: true})
        .withMessage("humidity should be not null")
        .isNumeric()
        .withMessage("humidity should be numeric"),
    body("year_built")
        .exists()
        .withMessage("year built can be null, but should exists")
        .isNumeric()
        .withMessage("year built should be numeric"),
    body("parking_slots")
        .exists()
        .withMessage("parking slots can be null, but should exists")
        .isNumeric()
        .withMessage("parking slots should be numeric"),
    body("use_machinery")
        .exists()
        .withMessage("use of machinery can be null, but should exists")
        .isBoolean()
        .withMessage("use of machinery should be boolean")
];