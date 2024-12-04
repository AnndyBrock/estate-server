import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import postRoute from "./src/routes/post.route.js"
import authRoute from "./src/routes/auth.route.js";
import userRoute from "./src/routes/user.route.js";
import chatRoute from "./src/routes/chat.route.js";
import messageRoute from "./src/routes/message.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json());

app.use(cookieParser())

app.use("/api/listings", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(PORT, () => {
    console.log("Server is running")
})
