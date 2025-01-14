import { describe, expect, it } from 'bun:test'
import { sanitize, sanitizeObject } from '../src/utils/sanitize.js'

describe('sanitize', () => {
  it('should sanitize a string with HTML entities', () => {
    const input = '<script>alert("XSS")</script>'
    const output = sanitize(input)
    expect(output).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
  })

  it('should trim leading and trailing whitespace', () => {
    const input = '  hello world  '
    const output = sanitize(input)
    expect(output).toBe('hello world')
  })

  it('should return null as-is', () => {
    const input = null
    const output = sanitize(input)
    expect(output).toBeNull()
  })

  it('should return non-string values as-is', () => {
    const input = 123
    const output = sanitize(input)
    expect(output).toBe(123)
  })

  it('should handle empty strings', () => {
    const input = ''
    const output = sanitize(input)
    expect(output).toBe('')
  })
})

describe('sanitizeObject', () => {
  it('should sanitize all string values in an object', () => {
    const input = { key1: '<script>', key2: 'hello' }
    const output = sanitizeObject(input)
    expect(output).toEqual({ key1: '&lt;script&gt;', key2: 'hello' })
  })

  it('should preserve null values in an object', () => {
    const input = { key1: null, key2: 'hello' }
    const output = sanitizeObject(input)
    expect(output).toEqual({ key1: null, key2: 'hello' })
  })

  it('should preserve non-string values in an object', () => {
    const input = { key1: 123, key2: true }
    const output = sanitizeObject(input)
    expect(output).toEqual({ key1: 123, key2: true })
  })

  it('should return null as-is', () => {
    const input = null
    const output = sanitizeObject(input)
    expect(output).toBeNull()
  })

  it('should return non-object values as empty objects', () => {
    const input = 'not an object'
    const output = sanitizeObject(input)
    expect(output).toEqual({})
  })

  it('should handle empty objects', () => {
    const input = {}
    const output = sanitizeObject(input)
    expect(output).toEqual({})
  })
})
