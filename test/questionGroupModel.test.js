import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { db } from '../src/models/db.js'
import { questionGroupModel } from '../src/models/questionGroupModel.js'

// Helper function to reset the database before each test
function resetDatabase() {
  db.query('DELETE FROM question_group').run()
}
function insertQuestionGroup(id, name, description) {
  db.query(
    'INSERT INTO question_group (id, name, description) VALUES (?, ?, ?)',
  ).run(id, name, description)
}

const group1 = {
  id: '1',
  name: 'Group 1',
  description: 'This is a test group',
}

const group2 = {
  id: '2',
  name: 'Group 2',
  description: 'This is another test group',
}
// Helper function to insert Group 1
function insertGroup1() {
  insertQuestionGroup(group1.id, group1.name, group1.description)
}

// Helper function to insert Group 2
function insertGroup2() {
  insertQuestionGroup(group2.id, group2.name, group2.description)
}

describe('questionGroupModel', () => {
  beforeEach(() => {
    resetDatabase() // Reset the database before each test
  })

  afterEach(() => {
    resetDatabase() // Clean up the database after each test
  })

  describe('list', () => {
    it('should return an empty array when no question groups exist', () => {
      const result = questionGroupModel.list()
      expect(result.data).toEqual([])
    })

    it('should return all question groups', () => {
      // Insert test data
      insertGroup1()
      insertGroup2()
      const result = questionGroupModel.list()
      expect(result.data).toEqual([group1, group2])
    })
  })

  describe('get', () => {
    it('should return an error if id is missing', () => {
      const result = questionGroupModel.get()
      expect(result.errors.all).toBe('Missing id')
    })

    it('should return an error if question group is not found', () => {
      const result = questionGroupModel.get('nonexistent-id')
      expect(result.errors.all).toBe('Question group not found')
    })

    it('should return the question group if it exists', () => {
      insertGroup1()

      const result = questionGroupModel.get('1')
      expect(result.data).toEqual(group1)
    })
  })

  describe('create', () => {
    it('should return an error if name is already taken', () => {
      insertGroup1()

      const result = questionGroupModel.create({ name: 'Group 1' })
      expect(result.errors.name).toBe('Question group name already exists')
    })

    it('should create a new question group', () => {
      const result = questionGroupModel.create({ name: 'New Group' })
      expect(result.data.id).toBeDefined()

      const createdGroup = db
        .query('SELECT * FROM question_group WHERE id = ?')
        .get(result.data.id)
      expect(createdGroup.name).toBe('New Group')
      expect(createdGroup.description).toBeNull()
      expect(createdGroup.id).toBe(result.data.id)
      expect(new Date(createdGroup.created_at).toString()).not.toBe(
        'Invalid Date',
      )
    })
  })

  describe('update', () => {
    it('should return an error if question group is not found', () => {
      const result = questionGroupModel.update('nonexistent-id', {
        name: 'Updated Group',
      })
      expect(result.errors.all).toBe('Question group not found')
    })

    it('should return an error if name is already taken', () => {
      insertGroup1()
      insertGroup2()

      const result = questionGroupModel.update('1', { name: 'Group 2' })
      expect(result.errors.name).toBe('Question group name already exists')
    })

    it('should update the question group', () => {
      insertGroup1()
      const result = questionGroupModel.update('1', { name: 'Updated Group' })
      expect(result.data.name).toBe('Updated Group')
      expect(result.data.id).toBe('1')

      const updatedGroup = db
        .query('SELECT * FROM question_group WHERE id = ?')
        .get('1')
      expect(updatedGroup.id).toBe('1')
      expect(updatedGroup.name).toBe('Updated Group')
    })
  })

  describe('remove', () => {
    it('should return an error if question group is not found', () => {
      const result = questionGroupModel.remove('nonexistent-id')
      expect(result.errors.all).toBe('Question group not found')
    })

    it('should remove the question group', () => {
      insertGroup1()

      const result = questionGroupModel.remove('1')
      expect(result.data).toEqual(group1)

      const deletedGroup = db
        .query('SELECT * FROM question_group WHERE id = ?')
        .get('1')
      expect(deletedGroup).toBeNull()
    })
  })

  describe('isNameTaken', () => {
    it('should return false if name is not taken', () => {
      const result = questionGroupModel.isNameTaken('New Group')
      expect(result).toBeFalse()
    })

    it('should return true if name is taken', () => {
      insertGroup1()

      const result = questionGroupModel.isNameTaken('Group 1')
      expect(result).toBeTrue()
    })

    it('should return false if name is taken by the same group (during update)', () => {
      insertGroup1()
      const result = questionGroupModel.isNameTaken('Group 1', '1')
      expect(result).toBeFalse()
    })
  })
})
