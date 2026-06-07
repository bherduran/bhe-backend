# bhe-backend

REST API powering [bherduran.com](https://bherduran.com) — blog posts and portfolio projects, with a protected admin panel.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT + bcrypt
- **Security:** Helmet, CORS allowlist, rate limiting

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/posts` | — | List all posts |
| GET | `/posts/:id` | — | Get post by ID |
| POST | `/posts` | ✓ | Create post |
| PUT | `/posts/:id` | ✓ | Update post |
| DELETE | `/posts/:id` | ✓ | Delete post |
| GET | `/projects` | — | List all projects |
| POST | `/projects` | ✓ | Create project |
| PUT | `/projects/:id` | ✓ | Update project |
| DELETE | `/projects/:id` | ✓ | Delete project |
| POST | `/auth/login` | — | Admin login → JWT |

## Local Setup

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-here
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
```

```bash
npx prisma migrate dev
npm run dev
```

## Deployment

Deployed on [Render](https://render.com). Build command runs `prisma migrate deploy` automatically.
