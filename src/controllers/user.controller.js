import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return  res.status(200).json(users)
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Failed to get users"})
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.params.id}
        });

        console.log(user)

        if (user){
            return res.status(200).json(user)
        }
        return res.status(404).json({ message: 'User not found' });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Failed to get users"})
    }
};

export const updateUser = async (req, res) => {
    const {password, avatar, ...data} = req.body;

    let updatedPassword = null;
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...data,
                ...(updatedPassword && {password: updatedPassword}),
                ...(avatar && {avatar})
            },
        });

        return res.status(200).json(updatedUser);
    } catch (e) {
        console.error(e); // Log the error for debugging
        return res.status(500).json({ message: "Failed to update user" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found or deleted" });
        }

        await prisma.user.delete({
            where: { id: req.params.id },
        })

        return res.status(200).json({message: "Success"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Failed to delete users"})
    }
};
