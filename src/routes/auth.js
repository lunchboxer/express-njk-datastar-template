import { Router } from 'express'
import { login, logout, register } from '../controllers/authController.js'
import { onlyAuthenticated } from '../middleware/auth.js'
import { loadPage } from '../utils/sse-utils.js'
const authRouter = Router()

authRouter.get('/login', (req, res) => {
  if (req.query?.datastar) {
    return loadPage({
      req,
      res,
      data: { user: req.user },
    })
  }
  res.render('login')
})

authRouter.get('/register', (req, res) => {
  if (req.query?.datastar) {
    return loadPage({ req, res, data: { user: req.user } })
  }
  res.render('register')
})

authRouter.get('/profile', onlyAuthenticated, (req, res) => {
  if (req.query?.datastar) {
    return loadPage({ req, res, data: { user: req.user } })
  }
  res.render('profile')
})

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

export { authRouter }
