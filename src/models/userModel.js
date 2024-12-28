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

export const getUserById = async id => {
  if (!id) {
    throw new Error('Missing id')
  }
  const { getUserById } = queries
  const result = await client.execute({
    sql: getUserById,
    args: [id],
  })
  return result?.rows[0] || []
}

export const updateUser = async (id, data) => {
  if (!id) {
    throw new Error('Missing id')
  }
  if (!data) {
    throw new Error('Missing data')
  }
  const { updateUserById } = queries
  const result = await client.execute({
    sql: updateUserById,
    args: [data.username, data.name, data.email, data.role, id],
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
