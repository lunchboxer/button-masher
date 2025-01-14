import { camelToSnake, snakeToCamel } from '../utils/case-conversion.js'
import { sanitizeObject } from '../utils/sanitize.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const answerModel = {
  list: () => {
    const getAllStatement = db.query(queries.getAllAnswers)
    const result = getAllStatement.all()
    const answers = result.map(answer => snakeToCamel(sanitizeObject(answer)))
    return { data: answers }
  },
  get: id => {
    if (!id) {
      return { errors: { all: 'Missing id' } }
    }
    const getAnswerByIdStatement = db.query(queries.getAnswerById)
    const result = getAnswerByIdStatement.get(id)
    const answer = snakeToCamel(sanitizeObject(result))
    return {
      data: answer,
      errors: answer ? null : { all: 'Answer not found' },
    }
  },
  create: data => {
    try {
      const uniqueErrors = answerModel._checkUniqueConstraints(data)
      if (uniqueErrors) {
        return { ...uniqueErrors }
      }
      const id = generateId()
      const sanitizedData = sanitizeObject(data)
      const useableData = camelToSnake(sanitizedData)
      db.query(queries.createAnswer).run({ ...useableData, id })
      return { data: { id } }
    } catch (error) {
      console.error('error', error)
      return { errors: { all: error.message } }
    }
  },

  update: (id, data) => {
    const { data: existingAnswer } = answerModel.get(id)
    if (!existingAnswer) {
      return { errors: { all: 'Answer not found' } }
    }

    const sanitizedUpdateData = sanitizeObject({ ...existingAnswer, ...data })
    const uniqueErrors = answerModel._checkUniqueConstraints(
      sanitizedUpdateData,
      id,
    )
    if (uniqueErrors) {
      return { ...uniqueErrors }
    }

    try {
      db.query(queries.updateAnswerById).run(camelToSnake(sanitizedUpdateData))
      return { data: { id } }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  remove: id => {
    const { data: existingAnswer } = answerModel.get(id)
    if (!existingAnswer) {
      return { errors: { all: 'Answer not found' } }
    }
    try {
      db.query(queries.removeAnswerById).run(id)
      return { data: existingAnswer }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  /**
   * Checks unique constraints for answer data
   * @param {Object} data - The answer data to check
   * @param {String} id - The ID of the answer to update
   * @returns {Object} Unique constraint errors
   */
  _checkUniqueConstraints: (data, id) => {
    // Check for unique answer per question
    const existingAnswer = db
      .query(queries.getAnswerByQuestionIdAndText)
      .get(data.questionId, data.answerText)
    if (existingAnswer && existingAnswer.id !== id) {
      return {
        errors: { answerText: 'Answer already exists for this question' },
      }
    }
  },
}
