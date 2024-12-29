import { Router } from 'express'
import { allUsers } from '../controllers/userController.js'
import {
  createUser,
  deleteUser,
  editUser,
  showCreateUserForm,
  showUser,
  showUserForm,
} from '../controllers/userController.js'
import { changePassword } from '../controllers/authController.js'
import { onlyAdmins, onlyAuthenticated } from '../middleware/auth.js'
const userRouter = Router()

userRouter
  .get('/', onlyAdmins, allUsers)
  .get('/create', onlyAdmins, showCreateUserForm)
  .post('/create', onlyAdmins, createUser)
  .get('/:id', onlyAdmins, showUser)
  .get('/:id/edit', onlyAdmins, showUserForm)
  .post('/:id', onlyAdmins, editUser)
  .post('/:id/delete', onlyAdmins, deleteUser)
  .post('/:id/change-password', onlyAuthenticated, changePassword)

export { userRouter }
