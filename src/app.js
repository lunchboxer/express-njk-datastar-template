import { join } from 'node:path'
import express from 'express'
import nunjucks from 'nunjucks'
import livereload from 'livereload'
import connectLivereload from 'connect-livereload'

const __dirname = import.meta.dirname

const dev = process.env.NODE_ENV !== 'production'

const appCssPath = join(__dirname, '../public/app.css')

console.error(appCssPath)

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

// Configure Nunjucks
nunjucks.configure(join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  noCache: dev,
})

app.use('/static', express.static(join(__dirname, '../public')))

app.set('view engine', 'html')

// Define a route
app.get('/', (_, res) => {
  res.render('index.html', { title: 'Home Page' })
})
app.use((req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.render('error.html', { url: req.url })
    return
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' })
    return
  }

  // default to plain-text. send()
  res.type('txt').send('Not found')
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`)
})
