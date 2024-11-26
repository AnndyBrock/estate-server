import express from "express";
import { getPost, deletePost, getPosts, addPost } from "../controllers/posts.controller.js"
import { authenticateToken } from "../middlewares/auth.middleware.js";
const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', authenticateToken, addPost)
router.delete('/:id', authenticateToken, deletePost)

export  default router;
