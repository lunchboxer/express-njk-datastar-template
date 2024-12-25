import { Router } from 'express'
import { loadUsers } from '../../controllers/userController.js'

const userRouter = Router()

userRouter.get('/', loadUsers)

export { userRouter }
