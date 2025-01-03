import { client } from '../models/db.js'
import { queries } from '../models/queryLoader.js'
import { verifyAndDecodeJwt } from '../utils/crypto.js'

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.auth

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const secretKey = process.env.JWT_SECRET

    if (!secretKey) {
      console.warn('JWT_SECRET is not set in environment variables')
      req.user = null
      return next()
    }

    const { id } = await verifyAndDecodeJwt(token, secretKey)

    const { getUserById } = queries
    const userResult = await client.execute({
      sql: getUserById,
      args: [id],
    })

    const user = userResult.rows[0]

    req.user = user
    res.locals.user = user

    next()
  } catch (error) {
    console.warn('Invalid JWT token', error)
    req.user = null
    next()
  }
}

export const onlyAuthenticated = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    const destination = req.originalUrl
    res.redirect(`/auth/login?redirect=${destination}`)
  }
}

export const onlyAdmins = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next()
  } else {
    const destination = req.originalUrl
    res.render('auth/admins-only', {
      destination,
    })
  }
}

export const onlyAdminsOrSelf = (req, _res, next) => {
  if (req.user?.role === 'admin' || req.user?.id === req.params.id) {
    next()
  } else {
    const error = new Error('Unauthorized')
    error.status = 403
    return next(error)
  }
}
