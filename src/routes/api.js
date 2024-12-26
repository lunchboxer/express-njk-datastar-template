import { Router } from 'express'
import { login, logout, apiRegister } from '../controllers/authController.js'

const apiRouter = Router()

apiRouter
  .post('/login', login)
  .post('/register', apiRegister)
  .post('/logout', logout)

  .use((err, _req, res, _next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message })
  })

  .use((_req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })

export { apiRouter }
