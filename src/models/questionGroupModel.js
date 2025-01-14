import { sanitizeObject } from '../utils/sanitize.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const questionGroupModel = {
  list: () => {
    const getAllStatement = db.query(queries.getAllQuestionGroups)
    const result = getAllStatement.all()
    const questionGroups = result.map(questionGroup =>
      sanitizeObject(questionGroup),
    )
    return {
      data: questionGroups,
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
    const questionGroup = sanitizeObject(result)
    if (!questionGroup) {
      return { errors: { all: 'Question group not found' } }
    }
    return { data: questionGroup }
  },

  create: data => {
    if (questionGroupModel.isNameTaken(data.name)) {
      return {
        errors: { name: 'Question group name already exists' },
      }
    }
    try {
      const id = generateId()
      const sanitizedData = sanitizeObject(data)
      db.query(queries.createQuestionGroup).run({
        description: null,
        ...sanitizedData,
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
    const sanitizedUpdateData = sanitizeObject(updateData)
    const updateStatement = db.query(queries.updateQuestionGroupById)
    updateStatement.run(sanitizedUpdateData)
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
