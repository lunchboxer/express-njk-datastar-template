import { Router } from 'express'
import {
  changePassword,
  showChangePasswordForm,
} from '../controllers/authController.js'
import { allUsers } from '../controllers/userController.js'
import {
  createUser,
  deleteUser,
  editUser,
  showCreateUserForm,
  showUser,
  showUserForm,
} from '../controllers/userController.js'
import { onlyAdmins, onlyAdminsOrSelf } from '../middleware/auth.js'
const userRouter = Router()

userRouter
  .get('/', onlyAdmins, allUsers)
  .get('/create', onlyAdmins, showCreateUserForm)
  .get('/:id/change-password', onlyAdminsOrSelf, showChangePasswordForm)
  .post('/create', onlyAdmins, createUser)
  .get('/:id', onlyAdmins, showUser)
  .get('/:id/edit', onlyAdmins, showUserForm)
  .post('/:id', onlyAdmins, editUser)
  .post('/:id/delete', onlyAdmins, deleteUser)
  .post('/:id/change-password', onlyAdminsOrSelf, changePassword)

export { userRouter }
