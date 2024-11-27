import express from "express";
import {getUser, getUsers, updateUser, deleteUser, savePost, userListings} from "../controllers/user.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

const router = express.Router()

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);
router.post('/save', authenticateToken, savePost);
router.get('/my/listings', authenticateToken, userListings);

export  default router;

