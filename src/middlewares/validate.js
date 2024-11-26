import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // Format the errors
    const extractedErrors = errors.array().map((err) => ({
        [err.param]: err.msg,
    }));

    return res.status(400).json({
        errors: extractedErrors,
    });
};
