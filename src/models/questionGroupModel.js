import { snakeToCamel } from '../utils/case-conversion.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'
import { questionModel } from './questionModel.js'

export const questionGroupModel = {
  list: () => {
    const getAllStatement = db.query(queries.getAllQuestionGroups)
    return {
      data: getAllStatement.all(),
    }
  },

  get: id => {
    if (!id) {
      return {
        errors: {
          all: 'Missing id',
        },
      }
    }
    const getQuestionGroupByIdStatement = db.query(queries.getQuestionGroupById)
    const result = getQuestionGroupByIdStatement.get(id)
    if (!result) {
      return { errors: { all: 'Question group not found' } }
    }

    const { data: questions } = questionModel.list(id, true)
    result.questions = questions
    return { data: snakeToCamel(result) }
  },

  create: data => {
    if (questionGroupModel.isNameTaken(data.name)) {
      return {
        errors: { name: 'Question group name already exists' },
      }
    }
    try {
      const id = generateId()
      db.query(queries.createQuestionGroup).run({
        ...data,
        id,
      })
      return {
        data: { id },
      }
    } catch (error) {
      return {
        errors: { all: error.message },
      }
    }
  },

  update: (id, data) => {
    const { data: existingQuestionGroup } = questionGroupModel.get(id)
    if (!existingQuestionGroup) {
      return { errors: { all: 'Question group not found' } }
    }

    const updateData = { ...existingQuestionGroup, ...data }
    if (data.name) {
      if (questionGroupModel.isNameTaken(data.name, id)) {
        return { errors: { name: 'Question group name already exists' } }
      }
    }
    const updateStatement = db.query(queries.updateQuestionGroupById)
    updateStatement.run(updateData)
    return { data: updateData }
  },

  remove: id => {
    const { data: existingQuestionGroup } = questionGroupModel.get(id)
    if (!existingQuestionGroup) {
      return { errors: { all: 'Question group not found' } }
    }
    const deleteStatement = db.query(queries.removeQuestionGroupById)
    deleteStatement.run(id)
    return { data: existingQuestionGroup }
  },

  isNameTaken: (name, id) => {
    if (id) {
      const statement = db.query(queries.questionGroupExistsByNameExcludingId)
      const result = statement.get(name, id)
      return !!result
    }
    const statement = db.query(queries.questionGroupExistsByName)
    const result = statement.get(name)
    return !!result
  },
}
