/**
 * @typedef {Object} LoginFormData
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterFormData
 * @property {string} name
 * @property {string} email
 * @property {string} password1
 * @property {string} password2
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {number} user_id
 * @property {string} username
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {Object.<string, string[]>} [errors]
 */