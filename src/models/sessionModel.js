import { camelToSnake, snakeToCamel } from '../utils/case-conversion.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const sessionModel = {
  /**
   * Retrieves all sessions
   * @returns {{data: Array<Object>|null, errors: Object|null}}
   * An object containing either an array of sessions or an error
   */
  list: () => {
    const getAllStatement = db.query(queries.getAllSessions)
    const result = getAllStatement.all()
    const sessions = result.map(session => snakeToCamel(session))
    return { data: sessions }
  },

  /**
   * Finds a session by its Id
   * @param {string} id - The session's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the session or an error
   */
  get: id => {
    if (!id) {
      return { errors: { all: 'Missing id' } }
    }
    const getSessionByIdStatement = db.query(queries.getSessionById)
    const result = getSessionByIdStatement.get(id)
    if (!result) {
      return { errors: { all: 'Session not found' } }
    }
    const session = snakeToCamel(result)
    return { data: session }
  },

  /**
   * Creates a new session
   * @param {Object} data - The session data to create
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the created session or an error
   */
  create: data => {
    try {
      const id = generateId()
      const accessCode = generateAccessCode() // Assuming a function to generate a unique 5-character code
      const usableData = camelToSnake({ ...data, id, accessCode })
      usableData.startTime = data.startTime
        ? new Date(data.startTime).toISOString()
        : new Date().toISOString()
      db.query(queries.createSession).run(camelToSnake(usableData))
      const { data: newSession } = sessionModel.get(id)
      return { data: snakeToCamel(newSession) }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  /**
   * Updates a session
   * @param {string} id - The session's unique identifier
   * @param {Object} data - The session data to update
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the updated session or an error
   */
  update: (id, data) => {
    const { data: existingSession } = sessionModel.get(id)
    if (!existingSession) {
      return { errors: { all: 'Session not found' } }
    }

    const updateData = camelToSnake({ ...existingSession, ...data })

    try {
      db.query(queries.updateSessionById).run(updateData)
      return { data: snakeToCamel(updateData) }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  /**
   * Removes a session
   * @param {string} id - The session's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the deleted session or an error
   */
  remove: id => {
    const { data: existingSession } = sessionModel.get(id)
    if (!existingSession) {
      return { errors: { all: 'Session not found' } }
    }
    try {
      db.query(queries.removeSessionById).run(id)
      return { data: snakeToCamel(existingSession) }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },
}

/**
 * Generates a unique 5-character access code for a session
 * @returns {string} A unique 5-character code
 */
const generateAccessCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
