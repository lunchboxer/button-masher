import { answerModel } from '../../models/answerModel.js'
import { redirect } from '../../utils/redirect.js'
import { createAnswerSchema } from '../../utils/validation-schemas.js'
import { validate } from '../../utils/validation.js'

export const POST = context => {
  const { isValid, errors: validationErrors } = validate(
    context.body,
    createAnswerSchema,
  )
  const { index } = context.body

  const errors = {}

  if (!isValid) {
    errors[`answer${index}`] = validationErrors
    context.setErrors(errors)
    redirect(context, `/question/${context.body.questionId}/edit`)
  }
  const { errors: creationErrors } = answerModel.create(context.body)
  if (creationErrors) {
    errors[`answer${index}`] = creationErrors.answerText
    context.setErrors(errors)
    redirect(context, `/question/${context.body.questionId}/edit`)
  }
  context.setAlert('Answer created successfully', 'success')
  return redirect(context, `/question/${context.body.questionId}/edit`)
}
