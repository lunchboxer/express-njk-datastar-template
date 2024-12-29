import { Router } from 'express'
import { login, logout, register } from '../controllers/authController.js'
import { onlyAuthenticated } from '../middleware/auth.js'
const authRouter = Router()

authRouter.get('/login', (req, res) =>
  res.render('auth/login', { title: 'Log in', user: req.user }),
)

authRouter.get('/register', (req, res) =>
  res.render('auth/register', { title: 'Register', user: req.user }),
)

authRouter.get('/profile', onlyAuthenticated, (req, res) =>
  res.render('auth/profile', { title: 'User Profile', user: req.user }),
)

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logout)

export { authRouter }
