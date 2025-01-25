import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { db } from '../src/models/db.js'
import { questionModel } from '../src/models/questionModel.js'

// Helper function to reset the database before each test
function resetDatabase() {
  db.query('DELETE FROM question').run()
  db.query('DELETE FROM answer').run()
  db.query('DELETE FROM question_group').run()
}

// Helper function to insert a question group
function insertQuestionGroup({ id, name, description }) {
  db.query(
    'INSERT INTO question_group (id, name, description) VALUES (?, ?, ?)',
  ).run(id, name, description)
}

// Helper function to insert a question
function insertQuestion(id, questionText, questionGroupId = null) {
  db.query(
    'INSERT INTO question (id, question_text, question_group_id) VALUES (?, ?, ?)',
  ).run(id, questionText, questionGroupId)
}

// Helper function to insert an answer
function insertAnswer(id, questionId, answerText, isCorrect = false) {
  db.query(
    'INSERT INTO answer (id, question_id, answer_text, is_correct) VALUES (?, ?, ?, ?)',
  ).run(id, questionId, answerText, isCorrect)
}

// Test data
const group1 = {
  id: '1',
  name: 'Group 1',
  description: 'This is a test group',
}

const question1 = {
  id: '1',
  questionText: 'What is 2 + 2?',
  questionGroupId: null,
}

const question2 = {
  id: '2',
  questionText: 'What is the capital of France?',
  questionGroupId: '1',
}

const answer1 = {
  id: '1',
  questionId: '1',
  answerText: '4',
  isCorrect: true,
}

const answer2 = {
  id: '2',
  questionId: '1',
  answerText: '5',
  isCorrect: false,
}

describe('questionModel', () => {
  beforeEach(() => {
    resetDatabase() // Reset the database before each test
    insertQuestionGroup(group1)
  })

  afterEach(() => {
    resetDatabase() // Clean up the database after each test
  })

  describe('list', () => {
    it('should return an empty array when no questions exist', () => {
      const result = questionModel.list()
      expect(result.data).toEqual([])
    })

    it('should return all questions', () => {
      insertQuestion(
        question1.id,
        question1.questionText,
        question1.questionGroupId,
      )
      insertQuestion(
        question2.id,
        question2.questionText,
        question2.questionGroupId,
      )

      const result = questionModel.list()
      expect(result.data).toEqual([question1, question2])
    })
  })

  describe('get', () => {
    it('should return an error if id is missing', () => {
      const result = questionModel.get()
      expect(result.errors.all).toBe('Missing id')
    })

    it('should return an error if question is not found', () => {
      const result = questionModel.get('nonexistent-id')
      expect(result.errors.all).toBe('Question not found')
    })

    it('should return the question if it exists', () => {
      insertQuestion(
        question1.id,
        question1.questionText,
        question1.questionGroupId,
      )

      const result = questionModel.get('1')
      expect(result.data).toMatchObject({
        id: question1.id,
        questionText: question1.questionText,
        questionGroupId: question1.questionGroupId,
        answers: [], // Ensure answers is an empty array
      })
      expect(result.data.createdAt).toBeDefined() // Ensure created_at is defined
      expect(new Date(result.data.createdAt)).toBeInstanceOf(Date) // Ensure created_at is a valid date
    })
  })

  describe('create', () => {
    it('should create a new question without answers', () => {
      const result = questionModel.create({ questionText: 'What is 2 + 2?' })

      // Check that the result contains an ID
      expect(result.data.id).toBeDefined()

      // Fetch the created question from the database
      const createdQuestion = db
        .query('SELECT * FROM question WHERE id = ?')
        .get(result.data.id)
      expect(createdQuestion.question_text).toBe('What is 2 + 2?')
    })

    it('should create a new question with answers', () => {
      const question = {
        questionText: 'What is 2 + 2?',
        answers: [
          { answerText: '4', isCorrect: true },
          { answerText: '5', isCorrect: false },
        ],
      }
      const result = questionModel.create(question)

      // Check that the result contains an ID
      expect(result.data.id).toBeDefined()

      // Fetch the created question from the database
      const createdQuestion = db
        .query('SELECT * FROM question WHERE id = ?')
        .get(result.data.id)
      expect(createdQuestion.question_text).toBe('What is 2 + 2?')

      // Fetch the associated answers from the database
      const answers = db
        .query('SELECT * FROM answer WHERE question_id = ?')
        .all(result.data.id)
      for (const [index, answer] of answers.entries()) {
        expect(answer.question_id).toBe(result.data.id)
        expect(answer.answer_text).toBe(question.answers[index].answerText)
        expect(!!answer.is_correct).toEqual(question.answers[index].isCorrect)
      }
    })
  })

  describe('update', () => {
    it('should return an error if question is not found', () => {
      const result = questionModel.update('nonexistent-id', {
        questionText: 'Updated question',
      })
      expect(result.errors.all).toBe('Question not found')
    })

    it('should update the question', () => {
      insertQuestion(
        question1.id,
        question1.questionText,
        question1.questionGroupId,
      )

      const result = questionModel.update('1', {
        questionText: 'What is 3 + 3?',
      })
      expect(result.data).toBeDefined()

      // Fetch the updated question from the database
      const updatedQuestion = db
        .query('SELECT * FROM question WHERE id = ?')
        .get('1')
      expect(updatedQuestion.question_text).toBe('What is 3 + 3?')
    })
  })

  describe('remove', () => {
    it('should return an error if question is not found', () => {
      const result = questionModel.remove('nonexistent-id')
      expect(result.errors.all).toBe('Question not found')
    })

    it('should remove the question and its answers', () => {
      insertQuestion(
        question1.id,
        question1.questionText,
        question1.questionGroupId,
      )
      insertAnswer(
        answer1.id,
        answer1.questionId,
        answer1.answerText,
        answer1.isCorrect,
      )
      insertAnswer(
        answer2.id,
        answer2.questionId,
        answer2.answerText,
        answer2.isCorrect,
      )

      const result = questionModel.remove('1')
      expect(result.data).toBeDefined()

      // Check that the question is deleted
      const deletedQuestion = db
        .query('SELECT * FROM question WHERE id = ?')
        .get('1')
      expect(deletedQuestion).toBeNull()

      // Check that the associated answers are deleted (due to ON DELETE CASCADE)
      const answers = db
        .query('SELECT * FROM answer WHERE question_id = ?')
        .all('1')
      expect(answers).toEqual([])
    })
  })
})
