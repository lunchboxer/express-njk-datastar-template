import { User } from '../models/userModel.js'

export const getUserOrThrow = async req => {
  const { data: user, errors } = await User.findById(req.params.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return user
}

export const renderFormWithErrors = async (req, res, view, formErrors) => {
  const user = await getUserOrThrow(req)
  return res.render(view, { selectedUser: user, errors: formErrors })
}

export const allUsers = async (_req, res, _next) => {
  const { data: users, errors } = await User.getAll()
  return res.render('user/index', {
    users,
    errors,
  })
}

export const showUser = async (req, res, _next) => {
  const user = await getUserOrThrow(req)
  return res.render('user/detail', { title: 'User', selectedUser: user })
}

export const showUserForm = async (req, res, _next) =>
  renderFormWithErrors(req, res, 'user/edit')

export const showCreateUserForm = (_req, res, _next) =>
  res.render('user/create')

export const editUser = async (req, res, _next) => {
  const { errors } = await User.update(req.params.id, req.body)
  if (errors) {
    return renderFormWithErrors(req, res, 'user/edit', errors)
  }
  req.session.alert = {
    type: 'success',
    message: `User "${req.body.username} updated successfully.".`,
  }
  return res.redirect(`/user/${req.params.id}`)
}

export const deleteUser = async (req, res, _next) => {
  const { errors } = await User.remove(req.params.id)
  if (errors) {
    return renderFormWithErrors(req, res, 'user/detail', errors)
  }
  req.session.alert = {
    type: 'success',
    message: `User deleted successfully.".`,
  }
  return res.redirect('/user')
}

export const createUser = async (req, res, _next) => {
  const { data, errors } = await User.create(req.body)
  if (errors) {
    return res.render('user/create', {
      user: req.body,
      errors,
    })
  }
  req.session.alert = {
    type: 'success',
    message: `User "${req.body.username}" created successfully.".`,
  }
  return res.redirect(`/user/${data.id}`)
}

// just for testing
export const checkUsernameAvailability = async (req, res, _next) => {
  const usernameTaken = await User.isUsernameTaken(req.body.username)
  return res.json({ usernameTaken })
}
