import { User } from '../models/userModel.js'

export const allUsers = async (_req, res, _next) => {
  const { data: users, errors } = await User.getAll()
  return res.render('user/index', { title: 'Users', users, errors })
}

export const showUser = async (req, res, next) => {
  const { data: user, errors } = await User.findById(req.params.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    return next(error)
  }
  return res.render('user/detail', { title: 'User', selectedUser: user })
}

export const showUserForm = async (req, res, next) => {
  const { data: user, errors } = await User.findById(req.params.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    return next(error)
  }
  return res.render('user/edit', { title: 'Edit User', selectedUser: user })
}

export const showCreateUserForm = (_req, res, _next) =>
  res.render('user/create', { title: 'Create User' })

export const editUser = async (req, res, _next) => {
  const { errors } = await User.update(req.params.id, req.body)
  if (errors) {
    return res.render('user/edit', {
      title: 'Edit User',
      selectedUser: req.body,
      errors,
    })
  }
  return res.redirect(`/user/${req.params.id}`)
}

export const deleteUser = async (req, res, next) => {
  const { errors } = await User.remove(req.params.id)
  if (errors) {
    const { data: user, errors: userErrors } = await User.findById(
      req.params.id,
    )
    if (userErrors) {
      const error = new Error('User not found')
      error.status = 400
      return next(error)
    }
    return res.render('user/detail', {
      title: 'User',
      selectedUser: user,
      errors,
    })
  }
  return res.redirect('/user')
}

export const createUser = async (req, res, _next) => {
  const { data, errors } = await User.create(req.body)
  if (errors) {
    return res.render('user/create', {
      title: 'Create User',
      user: req.body,
      errors,
    })
  }
  return res.redirect(`/user/${data.id}`)
}

// just for testing
export const checkUsernameAvailability = async (req, res, _next) => {
  const usernameTaken = await User.isUsernameTaken(req.body.username)
  return res.json({ usernameTaken })
}
