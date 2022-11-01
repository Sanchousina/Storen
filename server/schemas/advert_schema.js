import { body } from 'express-validator';

export const advertScema = [
    body("rental_rate")
        .exists({checkFalsy: true})
        .withMessage("rental rate is required")
        .isNumeric()
        .withMessage("rental rate should be numeric"),
    body("description")
        .exists()
        .withMessage("description can be null, but should exists")
        .trim()
        .escape()
];