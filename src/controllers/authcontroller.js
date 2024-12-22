import { nanoid } from 'nanoid'
import { client } from '../models/db.js'
import { queries } from '../models/queryLoader.js'
import { generateJwt, hashPassword, passwordMatches } from '../utils/crypto.js'

export const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body

    if (!(username && email && password)) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const hashedPassword = await hashPassword(password)
    const userId = nanoid()
    const { createUser } = queries
    await client.execute({
      sql: createUser,
      args: [userId, username, name || '', email, hashedPassword],
    })

    const token = await generateJwt(
      {
        id: userId,
        username,
        email,
      },
      process.env.JWT_SECRET,
    )

    res.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    res.redirect('/')
  } catch (error) {
    console.error('Registration error:', error)

    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username or email already exists' })
    }

    res.status(500).json({ error: 'Registration failed' })
  }
}

export const login = async (req, res, _next) => {
  try {
    const { username, password } = req.body

    if (!(username && password)) {
      return res.status(400).json({ error: 'Missing username or password' })
    }
    const { getUserByUsername } = queries
    const result = await client.execute({
      sql: getUserByUsername,
      args: [username],
    })

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    const isPasswordValid = await passwordMatches(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = await generateJwt(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    )
    res.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    res.redirect('/')
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}

export const logout = (_req, res) => res.clearCookie('auth').redirect('/')
