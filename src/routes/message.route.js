import express from "express";
import {createMessage} from "../controllers/message.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

const router = express.Router()
router.post('/:chatId', authenticateToken, createMessage);

export  default router;

