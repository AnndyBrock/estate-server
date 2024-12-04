import express from "express";
import {getChats, getChat, addChat, readChat} from "../controllers/chat.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

const router = express.Router()

router.get('/', authenticateToken, getChats);
router.get('/:id', authenticateToken, getChat);
router.post('/', authenticateToken, addChat);
router.put('/read/:id', authenticateToken, readChat);

export  default router;

