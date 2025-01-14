import { camelToSnake, snakeToCamel } from '../utils/case-conversion.js'
import { sanitizeObject } from '../utils/sanitize.js'
import { answerModel } from './answerModel.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const questionModel = {
  /**
   * Retrieves all questions
   * @returns {{data: Array<Object>|null, errors: Object|null}}
   * An object containing either an array of questions or an error
   */
  list: () => {
    const getAllStatement = db.query(queries.getAllQuestions)
    const result = getAllStatement.all()
    const questions = result.map(question => {
      const camelCaseQuestion = snakeToCamel(question)
      const sanitizedQuestion = sanitizeObject(camelCaseQuestion)
      return sanitizedQuestion
    })
    return { data: questions }
  },

  /**
   * Finds a question by its Id
   * @param {string} id - The questions's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the question or an error
   */
  get: id => {
    if (!id) {
      return { errors: { all: 'Missing id' } }
    }
    const getQuestionByIdStatement = db.query(queries.getQuestionById)
    const result = getQuestionByIdStatement.get(id)
    const question = sanitizeObject(snakeToCamel(result))
    return {
      data: question,
      errors: question ? null : { all: 'Question not found' },
    }
  },

  /**
   * Updates a question
   * @param {string} id - The question's unique identifier
   * @param {Object} data - The question data to update
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the updated question or an error
   */
  update: (id, data) => {
    const { data: existingQuestion } = questionModel.get(id)
    if (!existingQuestion) {
      return { errors: { all: 'Question not found' } }
    }

    const updateData = { ...existingQuestion, ...data }
    const sanitizedUpdateData = sanitizeObject(camelToSnake(updateData))

    try {
      db.query(queries.updateQuestionById).run(sanitizedUpdateData)
      return { data: sanitizeObject(updateData) }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  create: data => {
    const questionId = generateId()
    const snakeCaseData = camelToSnake({ questionGroupId: null, ...data })
    const sanitizedData = sanitizeObject({
      ...snakeCaseData,
      id: questionId,
    })

    db.query(queries.createQuestion).run(sanitizedData)

    // Create answers if provided
    if (sanitizedData.answers && Array.isArray(sanitizedData.answers)) {
      for (const [index, answer] of sanitizedData.answers.entries()) {
        const { data } = answerModel.create({ ...answer, questionId })
        sanitizedData.answers[index].id = data.id
      }
    }

    return { data: snakeToCamel(sanitizedData) }
  },

  /**
   * Removes a question
   * @param {string} id - The question's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the deleted question or an error
   */
  remove: id => {
    const existingQuestionResponse = questionModel.get(id)
    if (!existingQuestionResponse.data) {
      return { errors: { all: 'Question not found' } }
    }
    try {
      db.query(queries.removeQuestionById).run(id)
      return { data: existingQuestionResponse.data }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },
}
