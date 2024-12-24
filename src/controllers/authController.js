import { handleLogin, handleRegister } from '../models/authModel.js'
import { doesUsernameExist } from '../models/userModel.js'
import { setHeaders } from '../utils/sse-utils.js'

export const profile = (req, res, _next) => {
  const user = req.user
  res.render('profile', { user })
}

export const register = async (req, res, _next) => {
  try {
    const result = await handleRegister(req.body)
    if (result.errors) {
      return res.render('register', {
        user: req.user,
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
    return res.redirect(redirectUrl)
  } catch (error) {
    res.render('register', { user: req.user, error })
  }
}

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
    const { username, password } = req.body
    const result = await handleLogin(username, password)
    if (result.errors) {
      return res.render('login', {
        user: req.user,
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
    return res.redirect(redirectUrl)
  } catch (error) {
    res.render('login', { error })
  }
}

export const apiLogin = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }
    const { username, password } = req.body
    const result = await handleLogin(username, password)
    if (result.errors) {
      return res.status(400).json({ errors: result.errors })
    }
    res.cookie('auth', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    return res.json(result)
  } catch (error) {
    console.error('API Login error:', error)
    return res.status(400).json({ error: error.message })
  }
}

export const logout = (_req, res) => res.clearCookie('auth').redirect('/')
export const apiLogout = (_req, res) =>
  res.clearCookie('auth').status(204).end()

export const validateUsername = async (req, res, _next) => {
  setHeaders(res)
  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }
    const { username } = req.body
    if (!username) {
      return res.end()
    }
    const usernameExists = await doesUsernameExist(username)
    res.write('event: datastar-merge-signals\n')
    res.write('data: onlyIfMissing false\n')
    res.write(`data: signals { usernameExists: ${usernameExists} }\n\n`)
    return res.end()
  } catch (error) {
    console.error('validateUsername error:', error)
  }
}

export const magiclogin = async (req, res, _next) => {
  setHeaders(res)
  try {
    if (!req.body) {
      throw new Error('Missing request body')
    }
    const { username, password } = req.body
    const result = await handleLogin(username, password)
    if (result.success) {
      res.cookie('auth', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    }
    res.write('event: datastar-merge-signals\n')
    res.write('data: onlyIfMissing false\n')
    res.write(`data: signals { success: ${result.success} }\n\n`)
    return res.end()
  } catch (error) {
    console.error('validateUsername error:', error)
    res.write('event: datastar-merge-signals\n')
    res.write('data: onlyIfMissing false\n')
    res.write(`data: signals { errors: "${error}" }\n\n`)
    return res.end()
  }
}
