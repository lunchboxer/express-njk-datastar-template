import { getUsers } from '../models/userModel.js'
import { loadPage, setHeaders } from '../utils/sse-utils.js'

export const allUsers = async (_req, res, _next) => {
  const users = await getUsers()
  res.render('users', { users })
}

export const loadUsers = async (req, res, _next) => {
  setHeaders(res)
  const users = await getUsers()
  loadPage({ req, res, templatePath: 'pages/users.html', data: { users } })
}
