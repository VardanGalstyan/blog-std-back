import { Router } from 'express'
import BlogsModel from './schema.js'


const blogRouter = Router()


blogRouter.get('/', async (req, res, next) => {
    try {
        const blogs = await BlogsModel.find().populate('author')
        res.json(blogs)
    } catch (error) {
        next(error)
    }
})

export default blogRouter