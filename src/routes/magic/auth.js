import { Router } from 'express'
import {
  validateUsername,
  magiclogin,
} from '../../controllers/authController.js'

const authRouther = Router()

authRouther.post('/validate-username', validateUsername)
authRouther.post('/login', magiclogin)

export { authRouther }
