import { User } from '../models/userModel.js'

const getUserOrThrow = async (req, _res, _next) => {
  const { data: user, errors } = await User.findById(req.params.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return user
}

const renderFormWithErrors = async (req, res, next, view, formErrors) => {
  const user = await getUserOrThrow(req, res, next)
  return res.render(view, { selectedUser: user, errors: formErrors })
}

export const allUsers = async (_req, res, _next) => {
  const { data: users, errors } = await User.getAll()
  return res.render('user/index', { users, errors })
}

export const showUser = async (req, res, next) => {
  const user = await getUserOrThrow(req, res, next)
  return res.render('user/detail', { title: 'User', selectedUser: user })
}

export const showUserForm = async (req, res, next) =>
  renderFormWithErrors(req, res, next, 'user/edit')

export const showCreateUserForm = (_req, res, _next) =>
  res.render('user/create')

export const editUser = async (req, res, _next) => {
  const { errors } = await User.update(req.params.id, req.body)
  if (errors) {
    return renderFormWithErrors(req, res, _next, 'user/edit', errors)
  }
  return res.redirect(`/user/${req.params.id}`)
}

export const deleteUser = async (req, res, next) => {
  const { errors } = await User.remove(req.params.id)
  if (errors) {
    return renderFormWithErrors(req, res, next, 'user/detail', errors)
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
  return res.redirect(`/user/${data.id}`)
}

// just for testing
export const checkUsernameAvailability = async (req, res, _next) => {
  const usernameTaken = await User.isUsernameTaken(req.body.username)
  return res.json({ usernameTaken })
}

export const changePassword = async (req, res, next) => {
  const isAdminReset = req.body.admin_reset === 'true'

  let adminUser = null
  if (isAdminReset) {
    if (req.user.role !== 'admin') {
      const error = new Error('Unauthorized')
      error.status = 403
      return next(error)
    }
    adminUser = req.user
  }

  const { errors } = await User.changePassword(
    req.params.id,
    req.body,
    isAdminReset ? { adminUser } : {},
  )

  if (errors) {
    return renderFormWithErrors(req, res, next, 'user/edit', errors)
  }

  return res.redirect(`/user/${req.params.id}`)
}
