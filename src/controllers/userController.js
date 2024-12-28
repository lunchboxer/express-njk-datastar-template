import { getUserById, getUsers, updateUser } from '../models/userModel.js'
import { mergeFragment, setHeaders } from '../utils/sse-utils.js'
import { renderTemplate } from '../utils/utils.js'

export const allUsers = async (_req, res, _next) => {
  const users = await getUsers()
  return res.renderPage(undefined, { title: 'Users', users })
}

export const showUser = async (req, res, _next) => {
  const user = await getUserById(req.params.id)
  return res.renderPage('user/detail.html', { title: 'User', user })
}

export const showUserForm = async (req, res, _next) => {
  const user = await getUserById(req.params.id)
  return res.renderPage('user/edit.html', { title: 'Edit User', user })
}

export const editUser = async (req, res, _next) => {
  const user = await getUserById(req.params.id)
  try {
    await updateUser(req.params.id, req.body)
    return res.redirect(`/user/${user.id}`)
  } catch (error) {
    return res.renderPage('user/edit.html', {
      title: 'Edit User',
      user,
      errors: { all: error },
    })
  }
}

export const editUserLine = async (req, res, _next) => {
  const user = await getUserById(req.params.id)
  setHeaders(res)
  mergeFragment({
    res,
    fragments: renderTemplate('user/user-edit-line.html', { user }),
    selector: `#user-row-${user.id}`,
  })
  return res.end()
}
