import { validate } from '../utils/validation.js'
import { client, generateId } from './db.js'
import { queries } from './queryLoader.js'

const USER_VALIDATION_RULES = {
  // Base rules that apply to both create and update
  base: {
    username: {
      minLength: 3,
      maxLength: 20,
    },
    email: {
      email: true,
    },
    name: {
      maxLength: 50,
    },
    role: {
      oneOf: ['admin', 'user'],
    },
  },

  create: {
    username: { required: true },
    email: { required: true },
    name: { required: false },
    role: { required: true },
  },
}

export const User = {
  _mergeValidationRules: (baseRules, specificRules = {}) => {
    const mergedRules = { ...baseRules }

    for (const field of Object.keys(specificRules)) {
      mergedRules[field] = {
        ...mergedRules[field],
        ...specificRules[field],
      }
    }

    return mergedRules
  },
  _validate: (data, specificRules = {}) => {
    const rules = User._mergeValidationRules(
      USER_VALIDATION_RULES.base,
      specificRules,
    )

    return validate(data, rules)
  },

  /**
   * Retrieves all users
   * @returns {Promise<{data: Array<Object>|null, errors: Object|null}>}
   * An object containing either an array of users or an error
   */
  getAll: async () => {
    const { getAllUsers } = queries
    const result = await client.execute(getAllUsers)
    return {
      data: result.rows,
      errors: null,
    }
  },

  /**
   * Finds a user by their ID
   * @param {string} id - The user's unique identifier
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the user or an error
   */
  findById: async id => {
    if (!id) {
      return {
        data: null,
        errors: {
          all: 'Missing id',
        },
      }
    }
    const { getUserById } = queries
    const result = await client.execute({
      sql: getUserById,
      args: [id],
    })
    const user = result?.rows[0]
    return {
      data: user,
      errors: user ? null : { all: 'User not found' },
    }
  },

  /**
   * Finds a user by their username
   * @param {string} username - The user's username
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the user or an error
   */
  findByUsername: async (username, showPassword = false) => {
    if (!username) {
      return {
        data: null,
        errors: {
          all: 'Missing username',
        },
      }
    }
    const { getUserByUsername, getUserByUsernameWithPassword } = queries
    const sql = showPassword ? getUserByUsernameWithPassword : getUserByUsername
    const result = await client.execute({
      sql,
      args: [username],
    })
    const user = result?.rows[0]
    return {
      data: user,
      errors: user ? null : { all: 'User not found' },
    }
  },

  /**
   * Updates a user's information
   * @param {string} id - The user's unique identifier
   * @param {Object} data - The user data to update
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the updated user or an error
   */
  update: async (id, data) => {
    // Find existing user
    const existingUser = await User.findById(id)
    if (!existingUser) {
      return { data: null, errors: { all: 'User not found' } }
    }

    // Validate input data
    const validationResult = User._validate(data)
    if (!validationResult.isValid) {
      return { data: null, errors: validationResult.errors }
    }

    // Check for unique constraints if fields have changed
    if (data.username && data.username !== existingUser.username) {
      const usernameTaken = await User.isUsernameTaken(data.username, id)
      if (usernameTaken) {
        return { data: null, errors: { username: 'Username already exists' } }
      }
    }

    if (data.email && data.email !== existingUser.email) {
      const emailTaken = await User.isEmailTaken(data.email, id)
      if (emailTaken) {
        return { data: null, errors: { email: 'Email already exists' } }
      }
    }

    // Prepare update data, using existing values if not provided
    const updateData = {
      username: data.username || existingUser.username,
      name: data.name === '' ? null : data.name || existingUser.name,
      email: data.email || existingUser.email,
      role: data.role || existingUser.role,
    }

    try {
      const { updateUserById } = queries
      const result = await client.execute({
        sql: updateUserById,
        args: [
          updateData.username,
          updateData.name,
          updateData.email,
          updateData.role,
          id,
        ],
      })

      return {
        data: result?.rows[0] || null,
        errors: null,
      }
    } catch (error) {
      return {
        data: null,
        errors: { all: error.message },
      }
    }
  },

  /**
   * Removes a user
   * @param {string} id - The user's unique identifier
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the deleted user or an error
   */
  remove: async id => {
    const existingUser = await User.findById(id)
    if (!existingUser) {
      return {
        data: null,
        errors: {
          all: 'User not found',
        },
      }
    }
    try {
      const { removeUserById } = queries
      await client.execute({
        sql: removeUserById,
        args: [id],
      })
      return {
        data: existingUser,
        errors: null,
      }
    } catch (error) {
      return {
        data: null,
        errors: { all: error.message },
      }
    }
  },

  create: async data => {
    const validationResult = User._validate(data, USER_VALIDATION_RULES.create)

    if (!validationResult.isValid) {
      return {
        data: null,
        errors: validationResult.errors,
      }
    }

    const usernameTaken = await User.isUsernameTaken(data.username)
    if (usernameTaken) {
      return {
        data: null,
        errors: {
          username: 'Username already exists',
        },
      }
    }

    const emailTaken = await User.isEmailTaken(data.email)
    if (emailTaken) {
      return {
        data: null,
        errors: {
          email: 'Email already exists',
        },
      }
    }

    try {
      const id = generateId()
      const role = data.role || 'user'
      const { createUser } = queries
      await client.execute({
        sql: createUser,
        args: [id, data.username, data.name, data.email, data.password, role],
      })

      return {
        data: { id },
        errors: null,
      }
    } catch (error) {
      return {
        data: null,
        errors: { all: error.message },
      }
    }
  },

  /**
   * Checks if a username is already taken by another user
   * @param {string} username - The username to check for existence
   * @param {string} [excludeId] - Optional user ID to exclude from the check
   * @returns {Promise<boolean>} True if the username is taken, false otherwise
   */
  isUsernameTaken: async (username, excludeId = null) => {
    if (!username) {
      return
    }
    const { usernameTaken, usernameTakenExcludingId } = queries
    const result = await client.execute({
      sql: excludeId ? usernameTakenExcludingId : usernameTaken,
      args: excludeId ? [username, excludeId] : [username],
    })
    return !!result?.rows[0]?.[0]
  },

  /**
   * Checks if an email is already taken by another user
   * @param {string} email - The email to check for existence
   * @param {string} [excludeId] - Optional user ID to exclude from the check
   * @returns {Promise<boolean>} True if the email is taken, false otherwise
   */
  isEmailTaken: async (email, excludeId = null) => {
    if (!email) {
      return
    }
    const { emailTaken, emailTakenExcludingId } = queries
    const result = await client.execute({
      sql: excludeId ? emailTakenExcludingId : emailTaken,
      args: excludeId ? [email, excludeId] : [email],
    })
    return !!result?.rows[0]?.[0]
  },
}
