import prisma from "../lib/prisma.js"

export const getChats = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chats = await prisma.chat.findMany({
            where:{
                userIDs:{
                    hasSome: [tokenUserId]
                }
            },
        });

        for (const chat of chats) {
            const receiverId = chat.userIDs.find(id => id !== tokenUserId)

            const receiver = await prisma.user.findUnique({
                where: {
                    id: receiverId
                },
                select: {
                    id: true,
                    avatar: true,
                    firstName: true,
                    lastName: true
                }
            })

            chat.receiver = receiver;
        }

        return  res.status(200).json(chats)
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Failed to get chats"})
    }
};

export const getChat = async (req, res) => {
    try {
        const chatId = req.params.id;

        if (!chatId || !req.userId) {
            return res.status(400).json({ message: "Invalid request parameters" });
        }

        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                userIDs: {
                    hasSome: [req.userId],
                },
            },
            include: {
                users: true,
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (chat) {
            if (!chat.seenBy.includes(req.userId)) {
                await prisma.chat.update({
                    where: { id: chatId },
                    data: {
                        seenBy: {
                            set: [...new Set([...chat.seenBy, req.userId])],
                        },
                    },
                });
            }

            return res.status(200).json(chat);
        }

        return res.status(404).json({ message: "Chat not found or user not part of the chat" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Failed to get chat" });
    }
};

export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
    const receiverId = req.body.receiverId;

    try {
        const existingChat = await prisma.chat.findFirst({
            where: {
                userIDs: {
                    hasEvery: [tokenUserId, receiverId]
                }
            }
        });

        if (existingChat) {
            return res.status(200).json(existingChat);
        }

        const newChat = await prisma.chat.create({
            data: {
                users: {
                    connect: [
                        { id: tokenUserId },
                        { id: receiverId }
                    ]
                },
                userIDs: [tokenUserId, receiverId]
            }
        });

        return res.status(200).json(newChat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create or retrieve chat!" });
    }
};

export const readChat = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const chat = await prisma.chat.update({
            where:{
                id:req.params.id,
                userIds:{
                    hasSome:[tokenUserId]
                }
            },
            data: {
                seenBy: {
                    set: [tokenUserId]
                }
            }
        })
        res.status(200).json(chat)
    } catch (err) {
        res.status(500).json({ message: "Failed to delete users!" });
    }
};
