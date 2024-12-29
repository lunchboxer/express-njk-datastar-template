import { client } from './db.js'
import { queries } from './queryLoader.js'

export const User = {
  getAll: async () => {
    const { getAllUsers } = queries
    const res = await client.execute(getAllUsers)
    return res.rows
  },

  findById: async id => {
    if (!id) {
      throw new Error('Missing id')
    }
    const { getUserById } = queries
    const result = await client.execute({
      sql: getUserById,
      args: [id],
    })
    return result?.rows[0] || []
  },

  findByUsername: async username => {
    if (!username) {
      throw new Error('Missing username')
    }
    const { getUserByUsername } = queries
    const result = await client.execute({
      sql: getUserByUsername,
      args: [username],
    })
    return result?.rows[0] || []
  },
  update: async (id, data) => {
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
  },
  remove: async id => {
    if (!id) {
      throw new Error('Missing id')
    }
    const { removeUserById } = queries
    const result = await client.execute({
      sql: removeUserById,
      args: [id],
    })
    return result?.rows[0] || []
  },
}
