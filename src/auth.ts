import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'

const router = Router()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, try again in 15 minutes' },
})

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body

  if (email !== ADMIN_EMAIL) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)

  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '7d' })
  res.json({ token })
})

export default router
