import { camelToSnake, snakeToCamel } from '../utils/case-conversion.js'
import { answerModel } from './answerModel.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const questionModel = {
  /**
   * Retrieves all questions
   * @returns {{data: Array<Object>|null, errors: Object|null}}
   * An object containing either an array of questions or an error
   */
  list: (questionGroupId = null, includeAnswers = false) => {
    let query
    if (includeAnswers) {
      query = questionGroupId
        ? queries.getAllQuestionsAndAnswersByQuestionGroupId
        : queries.getAllQuestionsAndAnswers
    } else {
      query = questionGroupId
        ? queries.getQuestionsByQuestionGroupId
        : queries.getAllQuestions
    }
    const params = questionGroupId ? [questionGroupId] : []
    const getAllStatement = db.query(query)
    const result = getAllStatement.all(...params)
    const questions = result.map(question => {
      if (question.answers) {
        question.answers = JSON.parse(question.answers)
      }
      return snakeToCamel(question)
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
    const getQuestionStatement = db.query(queries.getQuestionAndAnswersById)
    const result = getQuestionStatement.get(id)
    if (!result) {
      return { errors: { all: 'Question not found' } }
    }
    result.answers = JSON.parse(result.answers)
    const question = snakeToCamel(result)

    return { data: question }
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

    const updateData = camelToSnake({ ...existingQuestion, ...data })

    try {
      db.query(queries.updateQuestionById).run(updateData)
      return { data: snakeToCamel(updateData) }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  create: data => {
    const id = generateId()
    const snakeCaseData = camelToSnake({ questionGroupId: null, id, ...data })
    db.query(queries.createQuestion).run(snakeCaseData)
    if (data.answers && Array.isArray(data.answers)) {
      for (const [index, answer] of snakeCaseData.answers.entries()) {
        const { data: createdAnswer } = answerModel.create({
          ...answer,
          questionId: id,
        })
        snakeCaseData.answers[index].id = createdAnswer.id
      }
    }
    return { data: snakeToCamel(snakeCaseData) }
  },

  /**
   * Removes a question
   * @param {string} id - The question's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the deleted question or an error
   */
  remove: id => {
    const { data: existingQuestion } = questionModel.get(id)
    if (!existingQuestion) {
      return { errors: { all: 'Question not found' } }
    }
    try {
      db.query(queries.removeQuestionById).run(id)
      return { data: snakeToCamel(existingQuestion) }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },
}
