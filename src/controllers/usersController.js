import { getUsers } from '../models/userModel.js'

export const allUsers = async (_, res) => {
  const users = await getUsers() // Call the model function
  res.render('users', { users })
}
