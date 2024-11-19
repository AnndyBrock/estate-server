import { body } from 'express-validator';

export const registerValidationRules = [
    body('firstName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('First name is required.')
        .isAlpha()
        .withMessage('First name must contain only letters.'),
    body('lastName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Last name is required.')
        .isAlpha()
        .withMessage('Last name must contain only letters.'),
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Please provide a valid email address.'),
    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number.'),
    body('company')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage('Company name must be less than 100 characters.'),
];

export const loginValidationRules = [
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
];
