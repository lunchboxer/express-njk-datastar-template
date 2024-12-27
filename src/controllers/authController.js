import { handleLogin, handleRegister } from '../models/authModel.js'
import { sendNotification } from '../utils/send-notification.js'
import {
  magicRedirect,
  mergeFragment,
  reloadHeader,
  setHeaders,
} from '../utils/sse-utils.js'

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

const loginResponseHandlers = {
  sse: {
    success: (res, result, redirectUrl) => {
      setHeaders(res)
      res.write('event: datastar-remove-signals\n')
      res.write('data: paths username \n')
      res.write('data: paths password \n\n')
      sendNotification(res, 'Login successful', 'success')
      magicRedirect(res, redirectUrl)
      reloadHeader(res, result.user)
      res.end()
    },
    error: (res, error) => {
      mergeFragment({
        res,
        fragments: `<div id="login-errors"><p class="error">${error}</p></div>`,
      })
    },
  },
  json: {
    success: (res, result) => res.json(result),
    error: (res, error) => res.status(400).json({ error: error.message }),
  },
  html: {
    success: (res, _result, redirectUrl) => res.redirect(redirectUrl),
    error: (res, error, body) =>
      res.render('base', {
        ...body,
        errors: error.message,
      }),
  },
}

// Determine response type
const getResponseType = req => {
  if (req.body?.sse) {
    return 'sse'
  }
  if (req.accepts('json')) {
    return 'json'
  }
  return 'html'
}

// Set auth cookie
const setAuthCookie = (res, token) => {
  res.cookie('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
}

export const login = async (req, res, _next) => {
  const responseType = getResponseType(req)
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
    return loginResponseHandlers[responseType].success(res, result, redirectUrl)
  } catch (error) {
    return loginResponseHandlers[responseType].error(res, error, req.body)
  }
}

export const register = async (req, res, _next) => {
  try {
    const result = await handleRegister(req.body)
    if (result.errors) {
      res.renderPage(undefined, { ...req.body, errors: result.errors })
    }
    setAuthCookie(res, result.token)
    const redirectUrl = req.query.redirect || '/'
    if (req.body?.sse) {
      setHeaders(res)
      res.write('event: datastar-remove-signals\n')
      res.write('data: paths username \n')
      res.write('data: paths password \n\n')
      sendNotification(res, 'Registration successful', 'success')
      magicRedirect(res, redirectUrl)
      reloadHeader(res, result.user)
      return res.end()
    }
    return res.redirect(redirectUrl)
  } catch (error) {
    res.renderPage(undefined, { errors: { all: error } })
  }
}

export const logout = (req, res) => {
  res.clearCookie('auth')
  if (req.body?.sse) {
    setHeaders(res)
    magicRedirect(res, '/')
    reloadHeader(res)
    sendNotification(res, 'Logout successful', 'success')
    return res.end()
  }
  if (req.accepts('html')) {
    return res.redirect('/')
  }
  if (req.accepts('json')) {
    return res.status(204)
  }
}
