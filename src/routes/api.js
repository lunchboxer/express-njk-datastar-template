import { Router } from 'express'
import {
  apiLogin,
  apiLogout,
  apiRegister,
} from '../controllers/authController.js'

const apiRouter = Router()

apiRouter
  .post('/login', apiLogin)
  .post('/register', apiRegister)
  .post('/logout', apiLogout)

  .use((err, _req, res, _next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message })
  })

  .use((_req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })

export { apiRouter }
