import { client } from './db.js'
import { queries } from './queryLoader.js'

const getUsers = async () => {
  const { getAllUsers } = queries
  const res = await client.execute(getAllUsers)
  return res.rows
}

export { getUsers }
