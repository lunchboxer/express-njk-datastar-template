import { verifyAndDecodeJwt } from '../utils/crypto.js'

export const authMiddleware = async (req, _res, next) => {
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

    const user = await verifyAndDecodeJwt(token, secretKey)

    req.user = user

    next()
  } catch (error) {
    console.warn('Invalid JWT token', error)
    req.user = null
    next()
  }
}
