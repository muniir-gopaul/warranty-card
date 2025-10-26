// src-ssr/routes/login.js
import { Router } from 'express'
import { connectMSSQL } from '../db/mssql.js'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

// 🟢 LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' })
  }

  try {
    const pool = await connectMSSQL()

    // Query both Login and Name
    const result = await pool.request().input('login', username).input('password', password).query(`
      SELECT Login, Name
      FROM dbo.VW_WA_UserList
      WHERE Login = @login AND Password = @password
    `)

    if (result.recordset.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    // ✅ Credentials are valid, store user info in session
    const user = {
      username: result.recordset[0].Login,
      name: result.recordset[0].Name,
    }

    req.session.user = user

    return res.json({
      success: true,
      message: 'Login successful',
      user: user,
    })
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

// 🔴 LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).json({ success: false, message: 'Logout failed' })
    }
    res.clearCookie('connect.sid') // remove the session cookie
    res.json({ success: true, message: 'Logged out successfully' })
  })
})

router.get('/session', (req, res) => {
  if (req.session?.user) {
    return res.json({ loggedIn: !!req.session?.user, user: req.session?.user || null })
  }
  return res.json({ loggedIn: false })
})

export default router
