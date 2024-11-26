import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, company, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                company,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ data: newUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

         const token = jwt.sign(
            { userId: existingUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = existingUser;

        return res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: 1000*60
        }).status(200).json({
            message: 'Login successful',
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
};

export const logout = (req, res) => res.clearCookie("token").status(200).json({ message: "SUCCESS"})
