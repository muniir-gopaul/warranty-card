import { Router } from 'express'
import { connectMSSQL } from '../db/mssql.js'

const router = Router()

// GET itemList
router.get('/itemlist', async (req, res) => {
  try {
    const pool = await connectMSSQL()
    const result = await pool.request().query(`
      SELECT * FROM VW_WA_ItemList
    `)

    return res.json({
      success: true,
      data: result.recordset,
    })
  } catch (err) {
    console.error('[DB ERROR]', err)
    return res.status(500).json({
      success: false,
      error: 'Database query failed',
    })
  }
})

export default router
