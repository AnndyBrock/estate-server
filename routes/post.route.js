import express from "express";

const router = express.Router()

router.get('/', (req, res) => {
    console.log('fdsfdsf')
})

router.get('/:id', (req, res) => {
    console.log('fdsfdsf')
})

export  default router;
