import { body } from 'express-validator';

export const advertSchema = [
    body("rentalRate")
        .exists({checkFalsy: true})
        .withMessage("rental rate is required")
        .isNumeric()
        .withMessage("rental rate should be numeric"),
    body("description")
        .exists()
        .withMessage("description can be null, but should exists")
        .trim()
        .escape(),
    body("title")
        .exists({checkFalsy: true})
        .withMessage("title is required")
        .isString()
        .withMessage("title should be string"),
];