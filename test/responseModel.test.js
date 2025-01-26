import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { db } from '../src/models/db.js'
import { responseModel } from '../src/models/responseModel.js'

function resetDatabase() {
  db.query('DELETE FROM session').run()
  db.query('DELETE FROM response').run()
  db.query('DELETE FROM answer').run()
  db.query('DELETE FROM question').run()
  db.query('DELETE FROM question_group').run()
  db.query('DELETE FROM user').run()
}

// Helper function to insert a user
function insertUser({ id, username, name, email, password, role }) {
  db.query(
    'INSERT INTO user (id, username, name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(id, username, name, email, password, role)
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

// Helper function to insert a session
function insertSession({
  id,
  leaderId,
  accessCode,
  questionGroupId,
  startTime,
  endTime,
}) {
  db.query(
    'INSERT INTO session (id, leader_id, access_code, question_group_id, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(id, leaderId, accessCode, questionGroupId, startTime, endTime)
}

// Helper function to insert a response
function insertResponse({ id, userId, sessionId, questionId, answerId }) {
  db.query(
    'INSERT INTO response (id, user_id, session_id, question_id, answer_id) VALUES (?, ?, ?, ?, ?)',
  ).run(id, userId, sessionId, questionId, answerId)
}

// Test data
const student1 = {
  id: 'abc123',
  username: 'sally',
  name: 'Sally Stevens',
  email: 'ss@example.com',
  password: 'password1',
  role: 'student',
}
const teacher1 = {
  id: 'tuv890',
  username: 'mrjones',
  name: 'Mr Jones',
  email: 'mrj@example.com',
  password: 'password1',
  role: 'user',
}

const questionGroup1 = {
  id: 'def456',
  name: 'Questions about numbers',
  description: 'This is a test group',
}

const question1 = {
  id: 'ghi789',
  questionText: 'What is 2 + 2?',
  questionGroupId: 'def456',
}

const answer1 = {
  id: 'mno345',
  questionId: 'ghi789',
  answerText: '4',
  isCorrect: true,
}

const session1 = {
  id: 'pqr567',
  leaderId: 'tuv890',
  accessCode: 'ABCDE',
  questionGroupId: 'def456',
  startTime: '2023-10-01T10:00:00Z',
  endTime: '2023-10-01T11:00:00Z',
}

const response1 = {
  id: 'xyz789',
  userId: 'abc123',
  sessionId: 'pqr567',
  questionId: 'ghi789',
  answerId: 'mno345',
}

const foreignKeyConstraintRegex = /foreign key constraint/i

describe('responseModel', () => {
  beforeEach(() => {
    resetDatabase()

    insertUser(student1)
    insertUser(teacher1)
    insertQuestionGroup(questionGroup1)
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
    insertSession(session1)
  })

  afterEach(() => {
    resetDatabase()
  })

  describe('list', () => {
    it('should return an empty array when no responses exist', () => {
      const result = responseModel.list()
      expect(result.data).toEqual([])
    })

    it('should return all responses', () => {
      insertResponse(response1)

      const result = responseModel.list()
      expect(result.data).toEqual([
        {
          id: response1.id,
          userId: response1.userId,
          sessionId: response1.sessionId,
          questionId: response1.questionId,
          answerId: response1.answerId,
          respondedAt: expect.any(String), // Ensure respondedAt is a valid timestamp
        },
      ])
      expect(new Date(result.data[0].respondedAt)).toBeInstanceOf(Date)
    })
  })

  describe('get', () => {
    it('should return an error if id is missing', () => {
      const result = responseModel.get()
      expect(result.errors.all).toBe('Missing id')
    })

    it('should return an error if response is not found', () => {
      const result = responseModel.get('nonexistent-id')
      expect(result.errors.all).toBe('Response not found')
    })

    it('should return the response if it exists', () => {
      db.query(
        'INSERT INTO response (id, user_id, session_id, question_id, answer_id) VALUES (?, ?, ?, ?, ?)',
      ).run(
        response1.id,
        response1.userId,
        response1.sessionId,
        response1.questionId,
        response1.answerId,
      )

      const result = responseModel.get(response1.id)
      expect(result.data).toEqual({
        id: response1.id,
        userId: response1.userId,
        sessionId: response1.sessionId,
        questionId: response1.questionId,
        answerId: response1.answerId,
        respondedAt: expect.any(String), // Ensure respondedAt is a valid timestamp
      })
    })
  })
  describe('create', () => {
    it('should create a new response', () => {
      const result = responseModel.create({
        userId: student1.id,
        sessionId: session1.id,
        questionId: question1.id,
        answerId: answer1.id,
      })

      // Check that the result contains an ID
      expect(result.data.id).toBeDefined()

      // Fetch the created response from the database
      const createdResponse = db
        .query('SELECT * FROM response WHERE id = ?')
        .get(result.data.id)
      expect(createdResponse).toEqual({
        id: result.data.id,
        user_id: student1.id,
        session_id: session1.id,
        question_id: question1.id,
        answer_id: answer1.id,
        responded_at: expect.any(String), // Ensure respondedAt is a valid timestamp
      })
    })

    it('should return an error if userId is missing', () => {
      const result = responseModel.create({
        sessionId: session1.id,
        questionId: question1.id,
        answerId: answer1.id,
      })
      expect(result.errors.all).toBe('Missing parameter "user_id"')
    })

    it('should return an error if sessionId is missing', () => {
      const result = responseModel.create({
        userId: student1.id,
        questionId: question1.id,
        answerId: answer1.id,
      })
      expect(result.errors.all).toBe('Missing parameter "session_id"')
    })

    it('should return an error if questionId is missing', () => {
      const result = responseModel.create({
        userId: student1.id,
        sessionId: session1.id,
        answerId: answer1.id,
      })
      expect(result.errors.all).toBe('Missing parameter "question_id"')
    })

    it('should return an error if answerId is missing', () => {
      const result = responseModel.create({
        userId: student1.id,
        sessionId: session1.id,
        questionId: question1.id,
      })
      expect(result.errors.all).toBe('Missing parameter "answer_id"')
    })

    it('should return an error if userId does not exist', () => {
      const result = responseModel.create({
        userId: 'nonexistent-user-id',
        sessionId: session1.id,
        questionId: question1.id,
        answerId: answer1.id,
      })
      expect(result.errors.all).toMatch(foreignKeyConstraintRegex)
    })

    it('should return an error if sessionId does not exist', () => {
      const result = responseModel.create({
        userId: student1.id,
        sessionId: 'nonexistent-session-id',
        questionId: question1.id,
        answerId: answer1.id,
      })
      expect(result.errors.all).toMatch(foreignKeyConstraintRegex)
    })

    it('should return an error if questionId does not exist', () => {
      const result = responseModel.create({
        userId: student1.id,
        sessionId: session1.id,
        questionId: 'nonexistent-question-id',
        answerId: answer1.id,
      })
      expect(result.errors.all).toMatch(foreignKeyConstraintRegex)
    })

    it('should return an error if answerId does not exist', () => {
      const result = responseModel.create({
        userId: student1.id,
        sessionId: session1.id,
        questionId: question1.id,
        answerId: 'nonexistent-answer-id',
      })
      expect(result.errors.all).toMatch(foreignKeyConstraintRegex)
    })

    it('should return an error if database fails during creation', () => {
      // Mock a database failure for this test only
      const mockQuery = jest.spyOn(db, 'query').mockImplementation(() => {
        throw new Error('Database failure')
      })

      const result = responseModel.create({
        userId: student1.id,
        sessionId: session1.id,
        questionId: question1.id,
        answerId: answer1.id,
      })

      expect(result.errors.all).toBe('Database failure')

      // Restore the original db.query after the test
      mockQuery.mockRestore()
    })
  })
  describe('remove', () => {
    it('should remove an existing response', () => {
      // Insert a response to be removed
      insertResponse(response1)

      // Remove the response
      const result = responseModel.remove(response1.id)

      // Check that the result contains the deleted response
      expect(result.data).toEqual({
        id: response1.id,
        userId: response1.userId,
        sessionId: response1.sessionId,
        questionId: response1.questionId,
        answerId: response1.answerId,
        respondedAt: expect.any(String), // Ensure respondedAt is a valid timestamp
      })

      // Verify that the response no longer exists in the database
      const deletedResponse = db
        .query('SELECT * FROM response WHERE id = ?')
        .get(response1.id)
      expect(deletedResponse).toBeNull()
    })

    it('should return an error if id is missing', () => {
      const result = responseModel.remove()
      expect(result.errors.all).toBe('Missing id')
    })

    it('should return an error if response is not found', () => {
      const result = responseModel.remove('nonexistent-id')
      expect(result.errors.all).toBe('Response not found')
    })
  })
})
