import { Router } from 'express'
import { login, logout, register } from '../controllers/authController.js'
import { onlyAuthenticated } from '../middleware/auth.js'
const authRouter = Router()

authRouter
  .get('/login', (_req, res) => res.render('auth/login'))
  .get('/register', (_req, res) => res.render('auth/register'))
  .get('/profile', onlyAuthenticated, (_req, res) => res.render('auth/profile'))

  .post('/register', register)
  .post('/login', login)
  .get('/logout', logout)

export { authRouter }
