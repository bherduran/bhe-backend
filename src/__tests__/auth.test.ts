import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('../prisma.js', () => ({ default: {} }))

vi.mock('bcryptjs', () => ({
  default: {
    hashSync: (_pwd: string) => 'hashed',
    compareSync: (pwd: string, _hash: string) => pwd === 'correct-password',
  }
}))

process.env['JWT_SECRET'] = 'test-secret'
process.env['ADMIN_EMAIL'] = 'admin@example.com'
process.env['ADMIN_PASSWORD'] = 'correct-password'

const { default: app } = await import('../index.js')

describe('POST /auth/login', () => {
  it('returns 401 with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrong' })
    expect(res.status).toBe(401)
  })

  it('returns 401 with correct email but wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong-password' })
    expect(res.status).toBe(401)
  })

  it('returns a token with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'correct-password' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(typeof res.body.token).toBe('string')
  })
})

describe('GET /posts', () => {
  beforeEach(() => {
    const prisma = (await import('../prisma.js')).default as Record<string, unknown>
    prisma['post'] = { findMany: vi.fn().mockResolvedValue([]) }
  })

  it('returns 200 with an array', async () => {
    const res = await request(app).get('/posts')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /projects', () => {
  beforeEach(() => {
    const prisma = (await import('../prisma.js')).default as Record<string, unknown>
    prisma['project'] = { findMany: vi.fn().mockResolvedValue([]) }
  })

  it('returns 200 with an array', async () => {
    const res = await request(app).get('/projects')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
