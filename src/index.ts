import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import prisma from './prisma.js'
import authRouter from './auth.js'
import { authenticate } from './middleware.js'



const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Backend çalışıyor!' })
})

app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany()
  res.json(posts)
})


app.get('/posts/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const post = await prisma.post.findUnique({
    where: { id }
  })
  
  if (!post) {
    res.status(404).json({ error: 'Post not found' })
    return
  }
  
  res.json(post)
})

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`)
  
})

app.post('/posts', authenticate, async (req, res) => {
  const { title, content } = req.body
  const post = await prisma.post.create({
    data: {
      title,
      content
    }
  })
  res.json(post)
})

app.put('/posts/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params['id'] as string)
  const { title, content } = req.body
  const post = await prisma.post.update({
    where: { id },
    data: { title, content }
  })
  res.json(post)
})