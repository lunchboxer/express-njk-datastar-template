import { Router } from 'express'
import { allUsers } from '../controllers/userController.js'
import {
  editUser,
  editUserLine,
  showUser,
  showUserForm,
} from '../controllers/userController.js'
import { onlyAdmins } from '../middleware/auth.js'
const userRouter = Router()

userRouter.get('/', onlyAdmins, allUsers)
userRouter.get('/:id/edit-line', onlyAdmins, editUserLine)
userRouter.get('/:id', onlyAdmins, showUser)
userRouter.get('/:id/edit', onlyAdmins, showUserForm)
userRouter.post('/:id', onlyAdmins, editUser)

export { userRouter }
