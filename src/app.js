import { join } from 'node:path'
import connectLivereload from 'connect-livereload'
import cookieParser from 'cookie-parser'
import express from 'express'
import livereload from 'livereload'
import nunjucks from 'nunjucks'
import { errorHandler404, errorHandler500 } from './errorHandler.js'
import { authMiddleware } from './middleware/auth.js'
import { renderMiddleware } from './middleware/render-page.js'
import { setHeadersMiddleware } from './middleware/sse-headers.js'
import { templatePathMiddleware } from './middleware/template-path-from-route.js'
import { apiRouter } from './routes/api.js'
import { authRouter } from './routes/auth.js'
import { rootRouter } from './routes/root.js'
import { userRouter } from './routes/user.js'

const __dirname = import.meta.dirname

const dev = process.env.NODE_ENV !== 'production'

const appCssPath = join(__dirname, '../public/app.css')

if (dev) {
  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch([__dirname, appCssPath])
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/')
    }, 100)
  })
}

const app = express()

if (dev) {
  app.use(connectLivereload({ port: 35729 }))
}

// Add middleware for parsing JSON, cookies, and setting user context
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(authMiddleware)
app.use(setHeadersMiddleware)
app.use(templatePathMiddleware)
app.use(renderMiddleware)

nunjucks.configure(join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: dev,
})

app.use('/static', express.static(join(__dirname, '../public')))

app.set('view engine', 'html')

app.use('/api', apiRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/', rootRouter)

app.use(errorHandler500)
app.use(errorHandler404)

const PORT = 3000

app.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`)
})
