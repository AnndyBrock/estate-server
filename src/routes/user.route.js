import express from "express";
import {getUser, getUsers, updateUser, deleteUser} from "../controllers/user.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

const router = express.Router()

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export  default router;

