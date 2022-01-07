import { Router } from 'express'
import CommentModel from './schema.js'


const commentRouter = Router()


commentRouter.get('/comments', async (req, res, next) => {
    try {
        const comments = await CommentModel.find()
        res.json(comments)
    } catch (error) {
        next(error)
    }
})

commentRouter.get('/comments/commentId', async (req, res, next) => {
    try {
        const comment = await CommentModel.findById(req.params.commentId)
        res.json(comment)
    } catch (error) {
        next(error)
    }
})

export default commentRouter