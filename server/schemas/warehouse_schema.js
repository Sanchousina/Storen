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
    body("houseNum")
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
    body("availableSpace")
        .exists()
        .withMessage("available space can be null, but should exists")
        .isNumeric()
        .withMessage("available space should be numeric"),
    body("totalSpace")
        .exists({checkFalsy: true})
        .withMessage("total space should be not null")
        .isNumeric()
        .withMessage("total space space should be numeric"),
    body("seilingHeight")
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
    body("yearBuilt")
        .exists()
        .withMessage("year built can be null, but should exists")
        .isNumeric()
        .withMessage("year built should be numeric"),
    body("parkingSlots")
        .exists()
        .withMessage("parking slots can be null, but should exists")
        .isNumeric()
        .withMessage("parking slots should be numeric"),
    body("useMachinery")
        .exists()
        .withMessage("use of machinery can be null, but should exists")
        .isBoolean()
        .withMessage("use of machinery should be boolean")
];