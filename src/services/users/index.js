import { Router } from 'express'
import UserModel from './schema.js'
import { JWTAuthUserMiddleWear } from '../../auth/token.js'
import createHttpError from 'http-errors'
import { JTWAuthenticate } from '../../auth/tools.js'
import BlogsModel from '../blogs/schema.js'
import CommentModel from '../comments/schema.js'

const userRouter = Router()


// U S E R S     H E R E

userRouter.get('/', async (req, res, next) => {
    try {
        const users = await UserModel.find()
        res.json(users)
    } catch (error) {
        next(error)
    }
})

userRouter.get('/me', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id)
        res.json(user)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/', async (req, res, next) => {
    try {
        const newUser = await UserModel.create(req.body)
        const savedUser = await newUser.save()
        const accessToken = await JTWAuthenticate(savedUser)
        res.status(201).send({ savedUser, accessToken })
    } catch (error) {
        console.log("problem", error);
        next(error)
    }
})

userRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.checkCredentials(email, password)
        if (user) {
            const accessToken = await JTWAuthenticate(user)
            res.send({ accessToken, id: user._id })
        } else {
            next(createHttpError(401, "credentials are not ok!"))
        }

    } catch (error) {
        next(error)
    }
})

userRouter.put('/me', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id)
        if (user) {
            const updatedUser = await user.update(req.body)
            res.json(updatedUser)
        } else {
            next(createHttpError(404, "user not found!"))
        }
    } catch (error) {
        next(error)
    }
})


// B L O G S  H E R E

userRouter.get('/blogs/:articleId', async (req, res, next) => {
    try {
        const { articleId } = req.params
        const blog = await BlogsModel.findById(articleId)
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            })
        if (blog) {
            res.json(blog)
        } else {
            next(createHttpError(404, "blog not found!"))
        }
    } catch (error) {
        next(error)
    }
})

userRouter.post('/blogs', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const newArticle = await BlogsModel.create({ ...req.body, author: req.user._id })
        const savedArticle = await newArticle.save()
        res.status(201).send(savedArticle)
    } catch (error) {
        next(error)
    }
})

userRouter.put('/blogs/:articleId', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const { articleId } = req.params
        const updatedArticle = await BlogsModel.findByIdAndUpdate(articleId, req.body,
            { new: true }
        )
        res.status(200).send(updatedArticle)
    } catch (error) {
        next(error)
    }
})

userRouter.delete('/blogs/:articleId', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const { articleId } = req.params
        const deletedArticle = await BlogsModel.findByIdAndDelete(articleId)
        res.status(200).send(deletedArticle)
    } catch (error) {
        next(error)
    }
})

// C O M M E N T S    H E R E

userRouter.post('/comments/:blogId', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const { blogId } = req.params
        const newComment = await CommentModel.create({ ...req.body, author: req.user._id })
        await BlogsModel.findByIdAndUpdate(blogId, { $push: { comments: newComment._id } })
        const savedComment = await newComment.save()
        res.status(201).send(savedComment)
    } catch (error) {
        next(error)
    }
})

userRouter.get('/comments/me', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const comments = await CommentModel.find({ author: req.user._id })
        res.json(comments)
    } catch (error) {
        next(error)
    }
})

userRouter.put('/comments/:commentId', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const { commentId } = req.params
        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, req.body,
            { new: true }
        )
        res.status(200).send(updatedComment)
    } catch (error) {
        next(error)
    }
})

userRouter.delete('/comments/:commentId', JWTAuthUserMiddleWear, async (req, res, next) => {
    try {
        const { commentId } = req.params
        const deletedComment = await CommentModel.findByIdAndDelete(commentId)
        res.status(200).send(deletedComment)
    } catch (error) {
        next(error)
    }
})

export default userRouter