import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { answerModel } from '../src/models/answerModel.js'
import { db } from '../src/models/db.js'

// Helper function to reset the database before each test
function resetDatabase() {
  db.query('DELETE FROM answer').run()
  db.query('DELETE FROM question').run()
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

describe('answerModel', () => {
  beforeEach(() => {
    resetDatabase() // Reset the database before each test
    insertQuestionGroup(group1) // Insert a question group
    insertQuestion(
      question1.id,
      question1.questionText,
      question1.questionGroupId,
    ) // Insert a question
  })

  afterEach(() => {
    resetDatabase() // Clean up the database after each test
  })

  describe('list', () => {
    it('should return an empty array when no answers exist', () => {
      const result = answerModel.list()
      expect(result.data).toEqual([])
    })

    it('should return all answers', () => {
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

      const result = answerModel.list()
      expect(result.data).toEqual([
        { id: '1', questionId: '1', answerText: '4', isCorrect: 1 },
        { id: '2', questionId: '1', answerText: '5', isCorrect: 0 },
      ])
    })
  })

  describe('get', () => {
    it('should return an error if id is missing', () => {
      const result = answerModel.get()
      expect(result.errors.all).toBe('Missing id')
    })

    it('should return an error if answer is not found', () => {
      const result = answerModel.get('nonexistent-id')
      expect(result.errors.all).toBe('Answer not found')
    })

    it('should return the answer if it exists', () => {
      insertAnswer(
        answer1.id,
        answer1.questionId,
        answer1.answerText,
        answer1.isCorrect,
      )

      const result = answerModel.get('1')
      expect(result.data).toEqual({
        id: '1',
        questionId: '1',
        answerText: '4',
        isCorrect: 1,
      })
    })
  })

  describe('create', () => {
    it('should create a new answer', () => {
      const result = answerModel.create({
        questionId: '1',
        answerText: '4',
        isCorrect: true,
      })

      // Check that the result contains an ID
      expect(result.data.id).toBeDefined()

      // Fetch the created answer from the database
      const createdAnswer = db
        .query('SELECT * FROM answer WHERE id = ?')
        .get(result.data.id)
      expect(createdAnswer).toEqual({
        id: result.data.id,
        question_id: '1',
        answer_text: '4',
        is_correct: 1,
        created_at: expect.any(String),
      })
      expect(new Date(createdAnswer.created_at)).toBeInstanceOf(Date)
    })

    it('should return an error if answer already exists for the same question', () => {
      insertAnswer(
        answer1.id,
        answer1.questionId,
        answer1.answerText,
        answer1.isCorrect,
      )

      const result = answerModel.create({
        questionId: '1',
        answerText: '4',
        isCorrect: false,
      })

      expect(result.errors.answerText).toBe(
        'Answer already exists for this question',
      )
    })
  })

  describe('update', () => {
    it('should return an error if answer is not found', () => {
      const result = answerModel.update('nonexistent-id', {
        answerText: 'Updated answer',
      })
      expect(result.errors.all).toBe('Answer not found')
    })

    it('should update the answer', () => {
      insertAnswer(
        answer1.id,
        answer1.questionId,
        answer1.answerText,
        answer1.isCorrect,
      )

      const result = answerModel.update('1', {
        answerText: 'Updated answer',
        isCorrect: false,
      })
      expect(result.data.id).toBe('1')

      // Fetch the updated answer from the database
      const updatedAnswer = db
        .query('SELECT * FROM answer WHERE id = ?')
        .get('1')
      expect(updatedAnswer).toEqual({
        id: '1',
        question_id: '1',
        answer_text: 'Updated answer',
        is_correct: 0,
        created_at: expect.any(String), // Ensure created_at is a valid timestamp
      })
    })

    it('should return an error if updated answer already exists for the same question', () => {
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

      const result = answerModel.update('1', {
        answerText: '5', // Duplicate answer text for the same question
      })

      expect(result.errors.answerText).toBe(
        'Answer already exists for this question',
      )
    })
  })

  describe('remove', () => {
    it('should return an error if answer is not found', () => {
      const result = answerModel.remove('nonexistent-id')
      expect(result.errors.all).toBe('Answer not found')
    })

    it('should remove the answer', () => {
      insertAnswer(
        answer1.id,
        answer1.questionId,
        answer1.answerText,
        answer1.isCorrect,
      )

      const result = answerModel.remove('1')
      expect(result.data).toEqual({
        id: '1',
        questionId: '1',
        answerText: '4',
        isCorrect: 1,
      })

      // Check that the answer is deleted
      const deletedAnswer = db
        .query('SELECT * FROM answer WHERE id = ?')
        .get('1')
      expect(deletedAnswer).toBeNull()
    })
  })
})
