import { createClient } from '@libsql/client'
import { customAlphabet } from 'nanoid'

// nanoid by default uses [a-zA-Z0-9_-] but express uses '-' so we won't use that.
const URL_FRIENDLY_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
export const generateId = customAlphabet(URL_FRIENDLY_ALPHABET, 18)

const dev = process.env.NODE_ENV !== 'production'

export const client = createClient({
  url: dev ? process.env.DB_URL_DEV : process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
