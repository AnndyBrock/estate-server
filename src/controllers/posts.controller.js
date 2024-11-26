  import prisma from "../lib/prisma.js"

export const getPosts = async (req, res) => {
    const query = req.query
    try {
        const posts = await prisma.post.findMany({
            where:{
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 100000000
                },
                bedroom: parseInt(query.bedroom) || undefined

            }
        });

        return res.status(200).json(posts)
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Failed to get users"})
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include:{
                postDetail: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        company: true,
                        avatar: true
                    }
                }
            }
        })
        return  res.status(200).json(post)
    } catch (e) {
        return res.status(500).json({message: "Failed to get post"})
    }
};

export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const addedPost = await prisma.post.create({
            data:{
                ...body.postData,
                userId: tokenUserId,
                postDetail:  {
                    create: body.postDetail
                }
            }
        })

        return  res.status(200).json(addedPost)
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Failed to get users"})
    }
};
//
// export const updatePost = async (req, res) => {
//     try {
//         const post = await prisma.post.findUnique({
//             where: { id: req.params.id },
//         })
//
//         if (post.userId !== req.userId) {
//             return res.status(403).json({ message: "Not Authorized!" })
//         }
//
//         await prisma.post.delete({
//             where: {id: req.params.id}
//         })
//
//     } catch (e) {
//         console.log(e)
//         return res.status(500).json({message: "Failed to get users"})
//     }
// };

export const deletePost = async (req, res) => {

    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
        })

        if (post.userId !== req.userId) {
            return res.status(403).json({ message: "Not Authorized!" })
        }

        await prisma.post.delete({
            where: {id: req.params.id}
        })
        return res.status(200).json({ message: "Listing deleted"})
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Failed to get users"})
    }
};
