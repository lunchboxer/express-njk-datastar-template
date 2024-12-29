import { Router } from 'express'
import { apiRegister, login, logout } from '../controllers/authController.js'
import { checkUsernameAvailability } from '../controllers/userController.js'

const apiRouter = Router()

apiRouter
  .post('/login', login)
  .post('/register', apiRegister)
  .post('/logout', logout)
  // just for testing
  .post('/check-username-availability', checkUsernameAvailability)

  .use((err, _req, res, _next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message })
  })

  .use((_req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })

export { apiRouter }
