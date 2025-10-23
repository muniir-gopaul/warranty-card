// src-ssr/routes/login.js
import { Router } from 'express'
import { connectMSSQL } from '../db/mssql.js'
import jwt from 'jsonwebtoken'
import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

// ⚙️ Session middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 15 * 60 * 1000, // 15 mins
      httpOnly: true,
      sameSite: 'lax', // or 'strict'
      path: '/', // make sure cookie is sent on all routes
    },
  }),
)

const JWT_SECRET = process.env.JWT_SECRET

// 🟢 LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' })
  }

  try {
    const pool = await connectMSSQL()
    const result = await pool.request().input('username', username).input('password', password)
      .query(`
        SELECT Id, Username FROM dbo.User
        WHERE Username = @username AND Password = @password
      `)

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const user = result.recordset[0]
    const token = jwt.sign({ userId: user.Id, username: user.Username }, JWT_SECRET, {
      expiresIn: '1h',
    })

    req.session.user = { id: user.Id, username: user.Username }
    req.session.lastActivityAt = Date.now()

    return res.json({ success: true, user, token })
    // return res.json({ success: true, user })
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

// 🔴 LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.json({ success: true, message: 'Logged out successfully' })
  })
})

export default router
