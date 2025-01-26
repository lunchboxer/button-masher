import { camelToSnake, snakeToCamel } from '../utils/case-conversion.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const responseModel = {
  /**
   * Retrieves all responses
   * @returns {{data: Array<Object>|null, errors: Object|null}}
   * An object containing either an array of responses or an error
   */
  list: (sessionId = null) => {
    const query = sessionId
      ? queries.getResponsesBySessionId
      : queries.getAllResponses
    const parameters = sessionId ? [sessionId] : []
    const getAllStatement = db.query(query)
    const result = getAllStatement.all(...parameters)
    const responses = result.map(response => snakeToCamel(response))
    return { data: responses }
  },

  /**
   * Finds a response by its Id
   * @param {string} id - The response's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the response or an error
   */
  get: id => {
    if (!id) {
      return { errors: { all: 'Missing id' } }
    }
    const getResponseByIdStatement = db.query(queries.getResponseById)
    const result = getResponseByIdStatement.get(id)
    if (!result) {
      return { errors: { all: 'Response not found' } }
    }
    const response = snakeToCamel(result)
    return { data: response }
  },

  /**
   * Creates a new response
   * @param {Object} data - The response data to create
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the created response or an error
   */
  create: data => {
    try {
      const id = generateId()
      const useableData = camelToSnake(data)
      db.query(queries.createResponse).run({ ...useableData, id })
      return { data: { id, ...data } }
    } catch (error) {
      console.error('error', error)
      return { errors: { all: error.message } }
    }
  },

  /**
   * Removes a response
   * @param {string} id - The response's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the deleted response or an error
   */
  remove: id => {
    if (!id) {
      return { errors: { all: 'Missing id' } }
    }
    const { data: existingResponse } = responseModel.get(id)
    if (!existingResponse) {
      return { errors: { all: 'Response not found' } }
    }
    try {
      db.query(queries.removeResponseById).run(id)
      return { data: snakeToCamel(existingResponse) }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },
}
