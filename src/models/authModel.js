import { nanoid } from 'nanoid'
import { generateJwt, hashPassword, passwordMatches } from '../utils/crypto.js'
import { client } from './db.js'
import { queries } from './queryLoader.js'

export const handleLogin = async (username, password) => {
  if (!(username && password)) {
    throw new Error('Missing username or password')
  }

  const { getUserByUsername } = queries
  const result = await client.execute({
    sql: getUserByUsername,
    args: [username],
  })

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials')
  }

  const user = result.rows[0]
  const isPasswordValid = await passwordMatches(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

  const token = await generateJwt(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
  )

  return { success: true, message: 'Login successful', token }
}

export const handleRegister = async ({ username, password, email, name }) => {
  if (!(username && password && email)) {
    throw new Error('Missing username, email or password')
  }

  const { getUserByUsername } = queries
  const existingUser = await client.execute({
    sql: getUserByUsername,
    args: [username],
  })

  if (existingUser.rows.length > 0) {
    return {
      errors: {
        username: 'User already exists',
      },
    }
  }

  const hashedPassword = await hashPassword(password)
  const userId = nanoid()

  const { createUser } = queries
  await client.execute({
    sql: createUser,
    args: [userId, username, name, email, hashedPassword],
  })
  const token = await generateJwt({ id: userId }, process.env.JWT_SECRET)

  return { success: true, message: 'User registered successfully', token }
}
