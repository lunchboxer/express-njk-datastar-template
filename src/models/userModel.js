import { client } from './db.js'
import { queries } from './queryLoader.js'

export const getUsers = async () => {
  const { getAllUsers } = queries
  const res = await client.execute(getAllUsers)
  return res.rows
}

export const getUserByUsername = async username => {
  if (!username) {
    throw new Error('Missing username')
  }
  const { getUserByUsername } = queries
  const result = await client.execute({
    sql: getUserByUsername,
    args: [username],
  })
  return result?.rows[0] || []
}

export const doesUsernameExist = async username => {
  if (!username) {
    throw new Error('Missing username')
  }
  const { usernameExists } = queries
  const result = await client.execute({
    sql: usernameExists,
    args: [username],
  })
  return !!result?.rows[0]?.[0]
}
