import { User } from '../models/userModel.js'

export const allUsers = async (_req, res, _next) => {
  const users = await User.getAll()
  return res.render('user/index', { title: 'Users', users })
}

export const showUser = async (req, res, _next) => {
  const user = await User.findById(req.params.id)
  return res.render('user/detail', { title: 'User', user })
}

export const showUserForm = async (req, res, _next) => {
  const user = await User.findById(req.params.id)
  return res.render('user/edit', { title: 'Edit User', user })
}

export const editUser = async (req, res, _next) => {
  const user = await User.findById(req.params.id)
  try {
    await User.update(user.id, req.body)
    return res.redirect(`/user/${user.id}`)
  } catch (error) {
    return res.render('user/edit.html', {
      title: 'Edit User',
      user,
      errors: { all: error },
    })
  }
}

export const deleteUser = async (req, res, _next) => {
  const user = await User.findById(req.params.id)
  try {
    await User.remove(user.id)
    return res.redirect('/user')
  } catch (error) {
    return res.render('user/detail', {
      title: 'User',
      user,
      errors: { all: error },
    })
  }
}
