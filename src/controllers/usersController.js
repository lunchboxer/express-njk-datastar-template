import { getUsers } from '../models/userModel.js'

export const allUsers = async (_req, res, _next) => {
  const users = await getUsers()
  res.render('users', { users })
}
