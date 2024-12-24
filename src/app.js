import { join } from 'node:path'
import connectLivereload from 'connect-livereload'
import cookieParser from 'cookie-parser'
import express from 'express'
import livereload from 'livereload'
import nunjucks from 'nunjucks'
import { errorHandler404, errorHandler500 } from './errorHandler.js'
import { authMiddleware } from './middleware/auth.js'
import { apiRouter } from './routes/api.js'
import { authRouter } from './routes/auth.js'
import { magicRouter } from './routes/magic/index.js'
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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(authMiddleware)

nunjucks.configure(join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: dev,
})

app.use('/static', express.static(join(__dirname, '../public')))

app.set('view engine', 'html')

app.use('/magic', magicRouter)
app.use('/api', apiRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/', rootRouter)

app.use(errorHandler500)
app.use(errorHandler404)

const PORT = 3000

app.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`)
})
