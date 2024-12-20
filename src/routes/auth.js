import { Router } from 'express'
import { client } from '../models/db.js'
import { queries } from '../models/queryLoader.js'
import { generateJwt, hashPassword, passwordMatches } from '../utils/crypto.js'

const authRouter = Router()

// Registration route
authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Generate a unique user ID (you might want to use a more robust method in production)
    const userId = crypto.randomUUID()

    // Insert user into database
    const { createUser } = queries
    await client.execute({
      sql: createUser,
      args: [userId, username, name || '', email, hashedPassword],
    })

    // Generate JWT
    const token = await generateJwt(
      {
        id: userId,
        username,
        email,
      },
      process.env.JWT_SECRET,
    )

    // Set JWT as an HTTP-only cookie
    res.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: userId, username, email },
    })
  } catch (error) {
    console.error('Registration error:', error)

    // Check for unique constraint violation
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username or email already exists' })
    }

    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login route
authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' })
    }

    // Find user by username
    const { getUserByUsername } = queries
    const result = await client.execute({
      sql: getUserByUsername,
      args: [username],
    })

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Verify password
    const isPasswordValid = await passwordMatches(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = await generateJwt(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    )

    // Set JWT as an HTTP-only cookie
    res.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Logout route
authRouter.post('/logout', (req, res) => {
  // Clear the authentication cookie
  res.clearCookie('auth')
  res.json({ message: 'Logged out successfully' })
})

export { authRouter }
