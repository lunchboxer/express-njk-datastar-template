import { Router } from 'express'
import { allUsers } from '../controllers/usersController.js'
const userRouter = Router()

userRouter.get('/', allUsers)

export { userRouter }
