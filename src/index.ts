import 'dotenv/config'
import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import prisma from './prisma.js'
import authRouter from './auth.js'
import { authenticate } from './middleware.js'

const app = express()
const PORT = process.env['PORT'] || 3001

const ALLOWED_ORIGINS = [
  'https://portfolio-app-indol-three.vercel.app',
  'https://bherduran.com',
  'https://www.bherduran.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(express.json())
app.use(helmet())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again in 15 minutes.' }
})

app.use('/auth', authLimiter, authRouter)

app.get('/', (req, res) => {
  res.json({ message: 'API is running.' })
})

app.get('/posts', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

app.get('/posts/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return }
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) { res.status(404).json({ error: 'Post not found' }); return }
    res.json(post)
  } catch (err) {
    next(err)
  }
})

app.post('/posts', authenticate, async (req, res, next) => {
  try {
    const { title, content } = req.body
    const post = await prisma.post.create({ data: { title, content } })
    res.json(post)
  } catch (err) {
    next(err)
  }
})

app.put('/posts/:id', authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] as string)
    const { title, content } = req.body
    const post = await prisma.post.update({ where: { id }, data: { title, content } })
    res.json(post)
  } catch (err) {
    next(err)
  }
})

app.delete('/posts/:id', authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] as string)
    await prisma.post.delete({ where: { id } })
    res.json({ message: 'Post deleted' })
  } catch (err) {
    next(err)
  }
})

app.get('/projects', async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany()
    res.json(projects)
  } catch (err) {
    next(err)
  }
})

app.post('/projects', authenticate, async (req, res, next) => {
  try {
    const { title, description, github, live, category } = req.body
    const project = await prisma.project.create({ data: { title, description, github, live, category } })
    res.json(project)
  } catch (err) {
    next(err)
  }
})

app.put('/projects/:id', authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] as string)
    const { title, description, github, live, category } = req.body
    const project = await prisma.project.update({ where: { id }, data: { title, description, github, live, category } })
    res.json(project)
  } catch (err) {
    next(err)
  }
})

app.delete('/projects/:id', authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params['id'] as string)
    await prisma.project.delete({ where: { id } })
    res.json({ message: 'Project deleted' })
  } catch (err) {
    next(err)
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
