// src-ssr/db/mssql.js
import sql from 'mssql'
import dotenv from 'dotenv'
dotenv.config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

let pool = null
let keepAliveTimer = null

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Connect to MSSQL with retry logic and keep-alive.
 */
export async function connectMSSQL(maxRetries = 5, retryDelay = 3000) {
  if (pool) return pool

  let attempt = 0
  while (attempt < maxRetries) {
    try {
      console.log(`[MSSQL] 🔌 Connecting (attempt ${attempt + 1}/${maxRetries})...`)
      pool = await sql.connect(config)
      console.log('[MSSQL] ✅ Connected to database')
      startKeepAlive()
      return pool
    } catch (err) {
      console.error(`[MSSQL] ❌ Connection failed (attempt ${attempt + 1}):`, err.message)
      attempt++
      if (attempt < maxRetries) {
        console.log(`[MSSQL] ⏳ Retrying in ${retryDelay / 1000}s...`)
        await delay(retryDelay)
      } else {
        console.error('[MSSQL] ❌ All connection attempts failed. Server startup aborted.')
        throw err
      }
    }
  }
}

function startKeepAlive(intervalMs = 5 * 60 * 1000) {
  if (keepAliveTimer) return

  console.log(`[MSSQL] 🩺 Starting keep-alive ping every ${intervalMs / 1000 / 60} min`)

  keepAliveTimer = setInterval(async () => {
    try {
      if (!pool) return
      await pool.request().query('SELECT 1')
      console.log('[MSSQL] ✅ Keep-alive ping successful')
    } catch (err) {
      console.error('[MSSQL] ⚠️ Keep-alive ping failed:', err.message)
    }
  }, intervalMs)
}

export function closeMSSQL() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer)
    keepAliveTimer = null
  }
  if (pool) {
    console.log('[MSSQL] 🔌 Closing connection pool')
    pool.close()
    pool = null
  }
}
