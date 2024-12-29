import { Router } from 'express'
import { allUsers } from '../controllers/userController.js'
import {
  createUser,
  deleteUser,
  editUser,
  showUser,
  showUserForm,
} from '../controllers/userController.js'
import { onlyAdmins } from '../middleware/auth.js'
const userRouter = Router()

userRouter
  .get('/', onlyAdmins, allUsers)
  .get('/:id', onlyAdmins, showUser)
  .get('/:id/edit', onlyAdmins, showUserForm)
  .post('/:id', onlyAdmins, editUser)
  .post('/:id/delete', onlyAdmins, deleteUser)
  .post('/create', onlyAdmins, createUser)

export { userRouter }
