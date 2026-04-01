import express from 'express'
import cors from 'cors'
import prisma from './prisma.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

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