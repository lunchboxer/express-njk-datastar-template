import { Router } from 'express'
import {
  login,
  logout,
  magicLogout,
  register,
} from '../controllers/authController.js'
import { onlyAuthenticated } from '../middleware/auth.js'
const authRouter = Router()

authRouter.get('/login', (req, res) =>
  res.renderPage(undefined, { title: 'Log in', user: req.user }),
)

authRouter.get('/register', (req, res) =>
  res.renderPage(undefined, { title: 'Register', user: req.user }),
)

authRouter.get('/profile', onlyAuthenticated, (req, res) =>
  res.renderPage(undefined, { title: 'User Profile', user: req.user }),
)

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logout)
authRouter.post('/logout', magicLogout)

export { authRouter }
