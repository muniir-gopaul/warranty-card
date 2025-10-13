// src-ssr/routes/login.js
import { Router } from 'express'
import { connectMSSQL } from '../db/mssql.js'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

// 🟢 LOGIN
router.get('/', async (req, res) => {
  try {
    const pool = await connectMSSQL()
    const result = await pool.request().query(`
      SELECT * FROM dbo.VW_WA_CustomerList
    `)

    res.json({ success: true, data: result.recordset })
  } catch (err) {
    console.error('[MSSQL FETCH ERROR]', err)
    res.status(500).json({ success: false, error: 'Database fetch failed' })
  }
})

export default router
