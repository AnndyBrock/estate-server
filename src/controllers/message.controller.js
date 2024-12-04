import prisma from "../lib/prisma.js"
export const createMessage = async (req, res) => {
    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const { text } = req.body;

    if (!text || !chatId || !tokenUserId) {
        return res.status(400).json({ message: "Invalid input parameters" });
    }

    try {
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId],
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found or user not part of the chat" });
        }

        const message = await prisma.message.create({
            data: {
                text,
                chatId,
                userId: tokenUserId,
            },
        });

        await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                seenBy: [tokenUserId],
                lastMessage: text,
            },
        });

        return res.status(200).json(message);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to create message" });
    }
};
