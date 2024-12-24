import { Router } from 'express'
import { authRouther } from './auth.js'

const magicRouter = Router()

magicRouter
  .use('/auth', authRouther)

  .use((err, _req, res, _next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message })
  })

  .use((_req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })
export { magicRouter }
