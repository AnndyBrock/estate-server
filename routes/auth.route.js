import express from "express";
import { registerValidationRules, loginValidationRules } from '../middlewares/auth.validation.js';
import { validate } from '../middlewares/validate.js';
import {login, logout, register} from "../controllers/auth.controller.js";

const router = express.Router()

router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);

router.post('/logout', logout);

export  default router;

