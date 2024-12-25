import { Router } from 'express'
import {
  magiclogin,
  validateUsername,
  loadPlainAuthPage,
} from '../../controllers/authController.js'

const authRouter = Router()

authRouter.post('/validate-username', validateUsername)
authRouter.post('/login', magiclogin)
authRouter.get('/profile', loadPlainAuthPage)
authRouter.get('/login', loadPlainAuthPage)
authRouter.get('/register', loadPlainAuthPage)

export { authRouter }
