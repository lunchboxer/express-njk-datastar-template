import { join } from 'node:path'
import connectLivereload from 'connect-livereload'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'
import livereload from 'livereload'
import nunjucks from 'nunjucks'
import { errorHandler404, errorHandler500 } from './errorHandler.js'
import { alertsMiddleware } from './middleware/alerts.js'
import { authMiddleware } from './middleware/auth.js'
import { referrerMiddleware } from './middleware/referrer.js'
import { apiRouter } from './routes/api.js'
import { authRouter } from './routes/auth.js'
import { rootRouter } from './routes/root.js'
import { userRouter } from './routes/user.js'

const __dirname = import.meta.dirname

const dev = process.env.NODE_ENV !== 'production'
const test = process.env.NODE_ENV === 'test'

const appCssPath = join(__dirname, '../public/app.css')

if (dev && !test) {
  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch([__dirname, appCssPath])
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/')
    }, 100)
  })
}

export const app = express()

if (dev && !test) {
  app.use(connectLivereload({ port: 35729 }))
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(authMiddleware)
app.use(referrerMiddleware)
app.use(alertsMiddleware)

nunjucks.configure(join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: dev,
})

app.use(
  '/static',
  express.static(join(__dirname, '../public'), {
    maxAge: dev ? 0 : '1d',
  }),
)

app.use(
  '/static/fonts',
  express.static(join(__dirname, '../public/fonts'), {
    maxAge: '1y',
  }),
)

app.set('view engine', 'html')

app.use('/api', apiRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/', rootRouter)

app.use(errorHandler500)
app.use(errorHandler404)
