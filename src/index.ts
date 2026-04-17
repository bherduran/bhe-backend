import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { z } from 'zod'
import prisma from './prisma.js'
import authRouter from './auth.js'
import { authenticate } from './middleware.js'

const app = express()
const PORT = 3001

app.use(helmet())
app.use(cors({
  origin: ['https://portfolio-app-indol-three.vercel.app', 'https://bherduran.com', 'https://www.bherduran.com']
}))
app.use(express.json())
app.use('/auth', authRouter)

const PostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
})

const ProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  github: z.string().url().or(z.literal('')),
  live: z.string().url().or(z.literal('')),
  category: z.string().min(1).max(50),
})

function parseId(raw: string): number | null {
  const id = parseInt(raw)
  return isNaN(id) ? null : id
}

app.get('/', (req, res) => {
  res.json({ message: 'Backend çalışıyor!' })
})

app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany()
  res.json(posts)
})

app.get('/posts/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) { res.status(400).json({ error: 'Invalid ID' }); return }

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) { res.status(404).json({ error: 'Post not found' }); return }
  res.json(post)
})

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`)
})

app.post('/posts', authenticate, async (req, res) => {
  const parsed = PostSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }

  const post = await prisma.post.create({ data: parsed.data })
  res.json(post)
})

app.put('/posts/:id', authenticate, async (req, res) => {
  const id = parseId(req.params['id'] as string)
  if (!id) { res.status(400).json({ error: 'Invalid ID' }); return }

  const parsed = PostSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }

  const post = await prisma.post.update({ where: { id }, data: parsed.data })
  res.json(post)
})

app.delete('/posts/:id', authenticate, async (req, res) => {
  const id = parseId(req.params['id'] as string)
  if (!id) { res.status(400).json({ error: 'Invalid ID' }); return }

  await prisma.post.delete({ where: { id } })
  res.json({ message: 'Post deleted' })
})

app.get('/projects', async (req, res) => {
  const projects = await prisma.project.findMany()
  res.json(projects)
})

app.post('/projects', authenticate, async (req, res) => {
  const parsed = ProjectSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }

  const project = await prisma.project.create({ data: parsed.data })
  res.json(project)
})

app.put('/projects/:id', authenticate, async (req, res) => {
  const id = parseId(req.params['id'] as string)
  if (!id) { res.status(400).json({ error: 'Invalid ID' }); return }

  const parsed = ProjectSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return }

  const project = await prisma.project.update({ where: { id }, data: parsed.data })
  res.json(project)
})

app.delete('/projects/:id', authenticate, async (req, res) => {
  const id = parseId(req.params['id'] as string)
  if (!id) { res.status(400).json({ error: 'Invalid ID' }); return }

  await prisma.project.delete({ where: { id } })
  res.json({ message: 'Project deleted' })
})
