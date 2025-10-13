// src-ssr/server.js
import express from 'express'
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
import itemCardRoutes from './routes/mssql-data.js'
import { connectMSSQL } from './db/mssql.js'

export const create = defineSsrCreate(async () => {
  console.log('[SSR] ⏳ Connecting to MSSQL...')
  await connectMSSQL()
  console.log('[SSR] ✅ MSSQL ready. Starting app...')

  const app = express()

  app.disable('x-powered-by')
  if (process.env.PROD) {
    app.use(compression())
  }

  // Parse JSON body
  app.use(express.json())

  // 👉 Mount API routes
  app.use('/api/login', loginRoutes)
  app.use('/api/itemcard', itemCardRoutes)

  // 🔐 Session-protected middleware goes HERE
  app.use((req, res, next) => {
    // Allow login & static files
    if (
      req.path.startsWith('/api/login') ||
      req.path.startsWith('/public') ||
      req.path.startsWith('/favicon')
    ) {
      return next()
    }

    // Protect SSR routes
    const protectedRoutes = ['/warranty-card', '/profile']
    const isProtected = protectedRoutes.some((route) => req.path.startsWith(route))

    if (isProtected && !req.session?.user) {
      console.log('[AUTH] Redirecting unauthenticated to /login')
      return res.redirect('/login') // SSR redirect
    }

    next()
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
