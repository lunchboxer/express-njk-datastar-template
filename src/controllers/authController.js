import { User } from '../models/userModel.js'
import { generateJwt, hashPassword, passwordMatches } from '../utils/crypto.js'

const setAuthCookie = (res, token) => {
  res.cookie('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

export const apiRegister = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }
    const { username, password, email, name } = req.body

    if (!(username && password && email)) {
      throw new Error('Missing username, email or password')
    }

    const userExists = await User.isUsernameTaken(username)
    if (userExists) {
      return res.status(400).json({
        errors: {
          username: 'User already exists',
        },
      })
    }

    const hashedPassword = await hashPassword(password)

    const userData = {
      username,
      name,
      email,
      password: hashedPassword,
      role: 'user',
    }
    const { data: user, errors } = await User.create(userData)

    if (errors) {
      return res.status(400).json({ errors: errors })
    }

    const token = await generateJwt({ id: user.id }, process.env.JWT_SECRET)

    setAuthCookie(res, token)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const login = async (req, res, _next) => {
  const redirectUrl = req.query.redirect || '/'

  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }

    const { username, password } = req.body
    if (!(username && password)) {
      throw new Error('Username and password are required')
    }

    const { data: user, errors } = await User.findByUsername(username, true)
    if (errors) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await passwordMatches(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const token = await generateJwt({ id: user.id }, process.env.JWT_SECRET)

    setAuthCookie(res, token)
    return res.redirect(redirectUrl)
  } catch (error) {
    res.render('auth/login', {
      ...req.body,
      errors: { all: error.message },
    })
  }
}

const loadChangePasswordWithErrors = async (req, res, errors) => {
  const { data: user, errors: userErrors } = await User.findById(req.params.id)
  if (userErrors) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  return res.render('user/change-password', {
    selectedUser: user,
    errors,
  })
}

export const showChangePasswordForm = (req, res, _next) => {
  return loadChangePasswordWithErrors(req, res, null)
}

export const changePassword = async (req, res, _next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body

  if (newPassword !== confirmPassword) {
    return loadChangePasswordWithErrors(req, res, {
      confirmPassword: 'Passwords do not match',
    })
  }

  if (req.user.role !== 'admin') {
    const { data: user, errors } = await User.findById(req.params.id, true)
    if (errors) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }

    if (!passwordMatches(currentPassword, user.password)) {
      return loadChangePasswordWithErrors(req, res, {
        currentPassword: 'Invalid password',
      })
    }
  }

  const hashedPassword = await hashPassword(newPassword)

  User.patch(req.params.id, { password: hashedPassword })

  if (req.user.id === req.params.id) {
    return res.redirect('/auth/logout')
  }
  return res.redirect(`/user/${req.params.id}`)
}

export const register = async (req, res, _next) => {
  try {
    const { username, password, email, name } = req.body

    const hashedPassword = await hashPassword(password)

    const userData = {
      username,
      name,
      email,
      password: hashedPassword,
      role: 'user',
    }
    const { data: user, errors } = await User.create(userData)

    if (errors) {
      return res.render('auth/register', {
        ...req.body,
        errors,
      })
    }

    const token = await generateJwt({ id: user.id }, process.env.JWT_SECRET)

    setAuthCookie(res, token)
    const redirectUrl = req.query.redirect || '/'
    return res.redirect(redirectUrl)
  } catch (error) {
    return res.render('auth/register', {
      ...req.body,
      errors: { all: error.message },
    })
  }
}

export const logout = (req, res) => {
  res.clearCookie('auth')
  if (req.accepts('html')) {
    return res.redirect('/')
  }
  if (req.accepts('json')) {
    return res.status(204)
  }
}
