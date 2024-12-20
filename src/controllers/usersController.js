import { getUsers } from '../models/userModel.js'
import { asyncHandler } from '../errorHandler.js'

export const allUsers = asyncHandler(async (_req, res, _next) => {
  const users = await getUsers() // Call the model function
  res.render('users', { users })
})
