import { handleLogin, handleRegister } from '../models/authModel.js'
import { sendNotification } from '../utils/send-notification.js'
import {
  reloadHeader,
  setHeaders,
  magicRedirect,
  mergeFragment,
} from '../utils/sse-utils.js'
import { renderTemplate } from '../utils/utils.js'

export const apiRegister = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }
    const result = await handleRegister(req.body)
    if (result.errors) {
      return res.status(400).json({ errors: result.errors })
    }
    res.cookie('auth', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const login = async (req, res, _next) => {
  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }
    const { username, password } = req.body
    if (!username && password) {
      throw new Error('Username and password are required')
    }
    const result = await handleLogin(username, password)
    if (result.errors) {
      if (req.body?.sse) {
        mergeFragment({
          res,
          fragments: `<div id="login-errors"><p class="error">${result.errors}</p></div>`,
        })
      }
      if (req.accepts('json')) {
        return res.status(400).json({ errors: result.errors })
      }
      return res.render('login', { ...req.body, errors: result.errors })
    }
    res.cookie('auth', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    const redirectUrl = req.query.redirect || '/'

    if (req.body?.sse) {
      setHeaders(res)
      res.write('event: datastar-remove-signals\n')
      res.write('data: paths username \n')
      res.write('data: paths password \n\n')
      sendNotification(res, 'Login successful', 'success')
      magicRedirect(res, redirectUrl)
      reloadHeader(res, result.user)
      return res.end()
    }

    if (req.accepts('json')) {
      return res.json(result)
    }
    return res.redirect(redirectUrl)
  } catch (error) {
    if (req.body?.sse) {
      return mergeFragment({
        res,
        fragments: `<div id="login-errors"><p class="error">${error}</p></div>`,
      })
    }
    if (req.accepts('json')) {
      return res.status(400).json({ error: error.message })
    }
    return res.render('login', { errors: error.message })
  }
}

export const register = async (req, res, _next) => {
  try {
    const result = await handleRegister(req.body)
    if (result.errors) {
      if (req.body?.sse) {
        setHeaders(res)
        return mergeFragment({
          res,
          fragments: renderTemplate('pages/auth/register.html', {
            errors: result.errors,
          }),
          selector: 'main',
        })
      }
      return res.render('register', {
        ...req.body,
        errors: result.errors,
      })
    }
    res.cookie('auth', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
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
    if (req.body.sse) {
      setHeaders(res)
      return mergeFragment({
        res,
        fragments: renderTemplate('pages/auth/register.html', {
          errors: { all: error },
        }),
        selector: 'main',
      })
    }
    res.render('register', { user: req.user, error })
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
