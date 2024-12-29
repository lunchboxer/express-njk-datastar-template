import { Router } from 'express'
import { login, logout, register } from '../controllers/authController.js'
import { onlyAuthenticated } from '../middleware/auth.js'
const authRouter = Router()

authRouter
  .get('/login', (_req, res) => res.render('auth/login', { title: 'Log in' }))

  .get('/register', (_req, res) =>
    res.render('auth/register', { title: 'Register' }),
  )

  .get('/profile', onlyAuthenticated, (_req, res) =>
    res.render('auth/profile', { title: 'User Profile' }),
  )

  .post('/register', register)
  .post('/login', login)
  .get('/logout', logout)

export { authRouter }
