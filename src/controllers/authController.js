import { handleLogin, handleRegister } from '../models/authModel.js'

export const apiRegister = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }
    const result = await handleRegister(req.body)
    if (result.errors) {
      return res.status(400).json({ errors: result.errors })
    }
    setAuthCookie(res, result.token)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const setAuthCookie = (res, token) => {
  res.cookie('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
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

    const result = await handleLogin(username, password)
    if (result.errors) {
      throw new Error(result.errors)
    }

    setAuthCookie(res, result.token)
    return res.redirect(redirectUrl)
  } catch (error) {
    res.render('auth/login', {
      title: 'Log in',
      ...req.body,
      errors: error.message,
    })
  }
}

export const register = async (req, res, _next) => {
  try {
    const result = await handleRegister(req.body)
    if (result.errors) {
      res.render('auth/register', {
        title: 'Register',
        ...req.body,
        errors: result.errors,
      })
    }
    setAuthCookie(res, result.token)
    const redirectUrl = req.query.redirect || '/'
    return res.redirect(redirectUrl)
  } catch (error) {
    return res.render('auth/register', {
      title: 'Register',
      ...req.body,
      errors: { all: error },
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
