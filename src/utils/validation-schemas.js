import { extendSchema } from './validation.js'

export const createUserSchema = {
  username: { required: true, minLength: 3, maxLength: 20 },
  email: { required: true, email: true },
  name: { required: false, maxLength: 50 },
  role: { required: true, oneOf: ['admin', 'user'] },
  password: { required: true, minLength: 4, maxLength: 40 },
}

export const updateUserSchema = extendSchema(createUserSchema, {
  id: { required: true },
  password: { required: false },
})

export const adminChangePasswordSchema = {
  newPassword: { required: true, minLength: 6, maxLength: 40 },
  confirmPassword: { required: true, minLength: 6, maxLength: 40 },
}

export const changePasswordSchema = extendSchema(adminChangePasswordSchema, {
  currentPassword: { required: true, minLength: 6, maxLength: 40 },
})

export const loginSchema = {
  username: { required: true, minLength: 3, maxLength: 40 },
  password: { required: true, minLength: 4, maxLength: 40 },
}

export const studentLoginSchema = {
  sequence: { required: true, minLength: 4, maxLength: 8 },
}

export const createStudentSchema = {
  name: { required: true, minLength: 3, maxLength: 50 },
  password: { required: true, studentLogin: true },
}

export const updateStudentSchema = {
  name: { required: true, minLength: 3, maxLength: 50 },
  password: { required: true, studentLogin: true },
}

export const createQuestionGroupSchema = {
  name: { required: true, minLength: 3, maxLength: 50 },
  description: { required: false, maxLength: 1000 },
}

export const updateQuestionGroupSchema = createQuestionGroupSchema

export const createQuestionSchema = {
  questionText: { required: true, minLength: 3, maxLength: 500 },
  questionGroupId: { required: false, length: 16 },
}

export const updateQuestionSchema = {
  questionText: { required: true, minLength: 3, maxLength: 500 },
  questionGroupId: { required: false, length: 16 },
}

export const updateAnswerSchema = {
  answerText: { required: true, minLength: 1, maxLength: 100 },
  isCorrect: { required: true, oneOf: [true, false, '0', '1'] },
  questionId: { required: true, length: 16 },
}

export const createAnswerSchema = {
  answerText: { required: true, minLength: 1, maxLength: 100 },
  isCorrect: { required: true, oneOf: [true, false, '0', '1'] },
  questionId: { required: true, length: 16 },
}

export const addQuestionWithAnswersSchema = {
  questionText: { required: true, minLength: 3, maxLength: 500 },
}
