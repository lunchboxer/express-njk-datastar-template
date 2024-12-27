import { getUsers } from '../models/userModel.js'

export const allUsers = async (_req, res, _next) => {
  const users = await getUsers()
  return res.renderPage(undefined, { title: 'Users', users })
}
