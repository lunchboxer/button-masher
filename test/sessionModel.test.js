import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { db } from '../src/models/db.js'
import { sessionModel } from '../src/models/sessionModel.js'

// Helper function to reset the database before each test
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
}) {
  db.query(
    'INSERT INTO session (id, leader_id, access_code, question_group_id, start_time) VALUES (?, ?, ?, ?, ?)',
  ).run(id, leaderId, accessCode, questionGroupId, startTime)
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
  startTime: '2023-10-01T10:00:00.000Z',
}

describe('sessionModel', () => {
  beforeEach(() => {
    resetDatabase() // Reset the database before each test
    insertUser(student1) // Insert a user
    insertUser(teacher1) // Insert another user
    insertQuestionGroup(questionGroup1) // Insert a question group
    insertQuestion(
      question1.id,
      question1.questionText,
      question1.questionGroupId,
    ) // Insert a question
    insertAnswer(
      answer1.id,
      answer1.questionId,
      answer1.answerText,
      answer1.isCorrect,
    ) // Insert an answer
  })

  afterEach(() => {
    resetDatabase() // Clean up the database after each test
  })

  describe('list', () => {
    it('should return an empty array when no sessions exist', () => {
      const result = sessionModel.list()
      expect(result.data).toEqual([])
    })

    it('should return all sessions', () => {
      insertSession(session1)

      // Fetch the session to get the createdAt timestamp
      const sessionFromDb = db
        .query('SELECT * FROM session WHERE id = ?')
        .get(session1.id)

      const result = sessionModel.list()
      expect(result.data).toEqual([
        {
          id: session1.id,
          leaderId: session1.leaderId,
          accessCode: session1.accessCode,
          questionGroupId: session1.questionGroupId,
          questionGroupName: questionGroup1.name,
          leaderUsername: teacher1.username,
          startTime: session1.startTime,
          createdAt: sessionFromDb.created_at, // Include createdAt in the expected result
          endTime: null,
        },
      ])
    })
  })

  describe('get', () => {
    it('should return an error if id is missing', () => {
      const result = sessionModel.get()
      expect(result.errors.all).toBe('Missing id')
    })

    it('should return an error if session is not found', () => {
      const result = sessionModel.get('nonexistent-id')
      expect(result.errors.all).toBe('Session not found')
    })

    it('should return the session if it exists', () => {
      insertSession(session1)

      // Fetch the session to get the createdAt timestamp
      const sessionFromDb = db
        .query('SELECT * FROM session WHERE id = ?')
        .get(session1.id)

      const result = sessionModel.get(session1.id)
      expect(result.data).toEqual({
        id: session1.id,
        leaderId: session1.leaderId,
        accessCode: session1.accessCode,
        questionGroupId: session1.questionGroupId,
        startTime: session1.startTime,
        createdAt: sessionFromDb.created_at, // Include createdAt in the expected result
        endTime: null,
      })
    })
  })

  describe('create', () => {
    it('should create a new session', () => {
      const result = sessionModel.create({
        leaderId: teacher1.id,
        questionGroupId: questionGroup1.id,
        startTime: '2023-10-01T10:00:00.000Z',
      })

      // Check that the result contains an ID and access code
      expect(result.data.id).toBeDefined()
      expect(result.data.accessCode).toBeDefined()

      // Fetch the created session from the database
      const createdSession = db
        .query('SELECT * FROM session WHERE id = ?')
        .get(result.data.id)
      expect(createdSession).toEqual({
        id: result.data.id,
        leader_id: teacher1.id,
        access_code: result.data.accessCode,
        question_group_id: questionGroup1.id,
        start_time: '2023-10-01T10:00:00.000Z',
        created_at: expect.any(String),
        end_time: null,
      })
    })

    it('should return an error if database fails during creation', () => {
      // Mock a database failure for this test only
      const mockQuery = jest.spyOn(db, 'query').mockImplementation(() => {
        throw new Error('Database failure')
      })

      const result = sessionModel.create({
        leaderId: teacher1.id,
        questionGroupId: questionGroup1.id,
        startTime: '2023-10-01T10:00:00.000Z',
      })

      expect(result.errors.all).toBe('Database failure')

      // Restore the original db.query after the test
      mockQuery.mockRestore()
    })
  })

  describe('update', () => {
    it('should return an error if session is not found', () => {
      const result = sessionModel.update('nonexistent-id', {
        startTime: '2023-10-01T12:00:00Z',
      })
      expect(result.errors.all).toBe('Session not found')
    })

    it('should update the session', () => {
      insertSession(session1)
      const result = sessionModel.update(session1.id, {
        startTime: '2023-10-01T12:00:00Z',
      })
      expect(result.data).toBeDefined()

      // Fetch the updated session from the database
      const updatedSession = db
        .query('SELECT * FROM session WHERE id = ?')
        .get(session1.id)
      expect(updatedSession.start_time).toBe('2023-10-01T12:00:00Z')
    })
  })

  describe('remove', () => {
    it('should return an error if session is not found', () => {
      const result = sessionModel.remove('nonexistent-id')
      expect(result.errors.all).toBe('Session not found')
    })

    it('should remove the session', () => {
      insertSession(session1)

      // Fetch the session before deletion to get the createdAt timestamp
      const sessionBeforeDeletion = db
        .query('SELECT * FROM session WHERE id = ?')
        .get(session1.id)

      const result = sessionModel.remove(session1.id)

      expect(result.data).toEqual({
        id: session1.id,
        leaderId: session1.leaderId,
        accessCode: session1.accessCode,
        questionGroupId: session1.questionGroupId,
        startTime: session1.startTime,
        endTime: null,
        createdAt: sessionBeforeDeletion.created_at, // Include createdAt in the expected result
      })

      // Check that the session is deleted
      const deletedSession = db
        .query('SELECT * FROM session WHERE id = ?')
        .get(session1.id)
      expect(deletedSession).toBeNull()
    })
  })
})
