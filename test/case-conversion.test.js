import { describe, expect, it } from 'bun:test'
import { camelToSnake, snakeToCamel } from '../src/utils/case-conversion.js'

describe('camelToSnake', () => {
  it('should convert camelCase keys to snake_case', () => {
    const input = { camelCaseKey: 'value', anotherKey: 123 }
    const output = camelToSnake(input)
    // biome-ignore lint/style/useNamingConvention: testing snake_case
    expect(output).toEqual({ camel_case_key: 'value', another_key: 123 })
  })

  it('should handle null input', () => {
    const input = null
    const output = camelToSnake(input)
    expect(output).toBeNull()
  })

  it('should return non-object input as-is', () => {
    const input = 'not an object'
    const output = camelToSnake(input)
    expect(output).toBe(input)
  })

  it('should preserve null values', () => {
    const input = { key1: null, key2: 'value' }
    const output = camelToSnake(input)
    expect(output).toEqual({ key1: null, key2: 'value' })
  })

  it('should handle empty objects', () => {
    const input = {}
    const output = camelToSnake(input)
    expect(output).toEqual({})
  })

  it('should handle nested objects', () => {
    const input = { nestedObject: { camelCaseKey: 'value' } }
    const output = camelToSnake(input)
    // biome-ignore lint/style/useNamingConvention: testing snake_case
    expect(output).toEqual({ nested_object: { camel_case_key: 'value' } })
  })

  it('should handle arrays', () => {
    const input = [{ camelCaseKey: 'value' }, { anotherKey: 123 }]
    const output = camelToSnake(input)
    // biome-ignore lint/style/useNamingConvention: testing snake_case
    expect(output).toEqual([{ camel_case_key: 'value' }, { another_key: 123 }])
  })
})

describe('snakeToCamel', () => {
  it('should convert snake_case keys to camelCase', () => {
    // biome-ignore lint/style/useNamingConvention: testing snake_case
    const input = { snake_case_key: 'value', another_key: 123 }
    const output = snakeToCamel(input)
    expect(output).toEqual({ snakeCaseKey: 'value', anotherKey: 123 })
  })

  it('should handle null input', () => {
    const input = null
    const output = snakeToCamel(input)
    expect(output).toBeNull()
  })

  it('should return non-object input as-is', () => {
    const input = 'not an object'
    const output = snakeToCamel(input)
    expect(output).toBe(input)
  })

  it('should preserve null values', () => {
    const input = { key1: null, key2: 'value' }
    const output = snakeToCamel(input)
    expect(output).toEqual({ key1: null, key2: 'value' })
  })

  it('should handle empty objects', () => {
    const input = {}
    const output = snakeToCamel(input)
    expect(output).toEqual({})
  })

  it('should handle nested objects', () => {
    // biome-ignore lint/style/useNamingConvention: testing snake_case
    const input = { nested_object: { snake_case_key: 'value' } }
    const output = snakeToCamel(input)
    expect(output).toEqual({ nestedObject: { snakeCaseKey: 'value' } })
  })

  it('should handle arrays', () => {
    // biome-ignore lint/style/useNamingConvention: testing snake_case
    const input = [{ snake_case_key: 'value' }, { another_key: 123 }]
    const output = snakeToCamel(input)
    expect(output).toEqual([{ snakeCaseKey: 'value' }, { anotherKey: 123 }])
  })
})
