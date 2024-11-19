import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import postRoute from "./routes/post.route.js"
import authRoute from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json());

app.use(cookieParser())

app.use("/api/listing", postRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    console.log("Server is running")
})
