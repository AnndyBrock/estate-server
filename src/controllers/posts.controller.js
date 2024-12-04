  import prisma from "../lib/prisma.js"
  import jwt from "jsonwebtoken";

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
  const id = req.params.id;

  try {
      const post = await prisma.post.findUnique({
          where: { id: id },
          include: {
              postDetail: true,
              user: {
                  select: {
                      firstName: true,
                      lastName: true,
                      email: true,
                      phone: true,
                      company: true,
                      avatar: true,
                  },
              },
          },
      });

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      const token = req.cookies?.token;
      let isSaved = false;

      if (token) {
          try {
              const payload = jwt.verify(token, process.env.JWT_SECRET);

              if (!payload || !payload.userId) {
                  return res.status(401).json({ message: 'Invalid token' });
              }

              const saved = await prisma.savedPost.findUnique({
                  where: {
                      userId_postId: {
                          userId: payload.userId,
                          postId: id,
                      },
                  },
              });

              isSaved = saved ? true : false;
          } catch (err) {
              console.error('Token verification failed:', err);
          }
      }

      return res.status(200).json({ ...post, isSaved });
  } catch (e) {
      console.error('Error fetching post:', e);
      return res.status(500).json({ message: 'Failed to get post' });
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
