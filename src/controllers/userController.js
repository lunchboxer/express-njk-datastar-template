import { getUsers } from '../models/userModel.js'
import { loadPage } from '../utils/sse-utils.js'

export const allUsers = async (req, res, _next) => {
  const users = await getUsers()
  if (req.query?.datastar) {
    return loadPage({
      req,
      res,
      templatePath: 'pages/users.html',
      data: { users },
    })
  }
  res.render('users', { users })
}
