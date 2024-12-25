import { Router } from 'express'
import { allUsers } from '../controllers/userController.js'
import { onlyAdmins } from '../middleware/auth.js'
const userRouter = Router()

userRouter.get('/', onlyAdmins, allUsers)

export { userRouter }
