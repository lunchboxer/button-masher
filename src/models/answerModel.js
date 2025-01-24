import { camelToSnake, snakeToCamel } from '../utils/case-conversion.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const answerModel = {
  list: (questionId = null) => {
    const query = questionId
      ? queries.getAllAnswersByQuestionId
      : queries.getAllAnswers
    const parameters = questionId ? [questionId] : []
    const getAllStatement = db.query(query)
    const result = getAllStatement.all(...parameters)
    const answers = result.map(answer => snakeToCamel(answer))
    return { data: answers }
  },
  get: id => {
    if (!id) {
      return { errors: { all: 'Missing id' } }
    }
    const getAnswerByIdStatement = db.query(queries.getAnswerById)
    const result = getAnswerByIdStatement.get(id)
    const answer = snakeToCamel(result)
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
      const useableData = camelToSnake(data)
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

    const updateData = { ...existingAnswer, ...data }
    const uniqueErrors = answerModel._checkUniqueConstraints(updateData, id)
    if (uniqueErrors) {
      return { ...uniqueErrors }
    }

    try {
      db.query(queries.updateAnswerById).run(camelToSnake(updateData))
      return { data: updateData }
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
