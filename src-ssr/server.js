// src-ssr/server.js
import express from 'express'
import session from 'express-session'
import compression from 'compression'
import {
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrClose,
  defineSsrServeStaticContent,
  defineSsrRenderPreloadTag,
} from '#q-app/wrappers'

import loginRoutes from './routes/login.js'
import itemListRoutes from './routes/itemList.js'
import soapRoutes from './routes/soapClient.js'
import { connectMSSQL } from './db/mssql.js'

export const create = defineSsrCreate(async () => {
  console.log('[SSR] ⏳ Connecting to MSSQL...')
  await connectMSSQL()
  console.log('[SSR] ✅ MSSQL ready. Starting app...')

  const app = express()

  app.disable('x-powered-by')

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  if (process.env.PROD) {
    app.use(compression())
  }

  // Parse JSON
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // 🧠 Session middleware (must be before route protection)
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.PROD === 'true',
        sameSite: 'lax',
      },
    }),
  )

  // ✅ Mount API routes early for /api/login (public)
  app.use('/api/login', loginRoutes)

  // 🧩 Mount protected API routes
  app.use('/soap', soapRoutes)
  app.use('/api/db', itemListRoutes)
  // 🔐 Global Auth middleware
  app.use((req, res, next) => {
    const publicPaths = ['/login']
    const allowPrefixes = [
      '/public',
      '/favicon',
      '/src',
      '/js',
      '/css',
      '/assets',
      '/img',
      '/@vite',
      '/@fs',
      '/@id',
      '/__vite',
      '/.quasar',
      '/node_modules',
    ]

    const isAllowed = allowPrefixes.some((prefix) => req.path.startsWith(prefix))
    const isPublic = publicPaths.some((path) => req.path.startsWith(path))

    if (req.path.startsWith('/api/login') || req.path.startsWith('/api/logout')) return next()
    if (isAllowed || isPublic) return next()

    if (!req.session?.user) {
      console.warn(`❌ Unauthorized access attempt: ${req.path}`)
      // For SSR pages, redirect to login
      return res.redirect('/login')
    }

    next()
  })

  // 🧩 Logout route
  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err)
        return res.status(500).json({ success: false, message: 'Logout failed' })
      }
      res.clearCookie('connect.sid')
      res.json({ success: true, message: 'Logged out successfully' })
    })
  })

  return app
})

export const injectDevMiddleware = defineSsrInjectDevMiddleware(({ app }) => {
  return (middleware) => {
    app.use(middleware)
  }
})

export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  const server = devHttpsApp || app
  return server.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
})

export const close = defineSsrClose(({ listenResult }) => {
  return listenResult.close()
})

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

export const serveStaticContent = defineSsrServeStaticContent(({ app, resolve }) => {
  return ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
    const serveFn = express.static(resolve.public(pathToServe), { maxAge: 0, ...opts })
    app.use(resolve.urlPath(urlPath), serveFn)
  }
})

export const renderPreloadTag = defineSsrRenderPreloadTag((file) => {
  if (jsRE.test(file)) return `<link rel="modulepreload" href="${file}" crossorigin>`
  if (cssRE.test(file)) return `<link rel="stylesheet" href="${file}" crossorigin>`
  if (woffRE.test(file))
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  if (woff2RE.test(file))
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  if (gifRE.test(file))
    return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
  if (jpgRE.test(file))
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
  if (pngRE.test(file))
    return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
  return ''
})
