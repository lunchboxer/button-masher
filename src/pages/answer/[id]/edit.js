import { answerModel } from '../../../models/answerModel.js'
import { redirect } from '../../../utils/redirect.js'
import { updateAnswerSchema } from '../../../utils/validation-schemas.js'
import { validate } from '../../../utils/validation.js'

export const POST = (context, _request, parameters) => {
  const { id } = parameters
  const { isValid, errors: validationErrors } = validate(
    context.body,
    updateAnswerSchema,
  )
  const errors = {}

  if (!isValid) {
    errors[`answer${id}`] = validationErrors
    context.setErrors(errors)
    const url = `/question/${context.body.questionId}/edit`
    return redirect(context, url)
  }
  const { errors: updateErrors } = answerModel.update(id, context.body)
  if (updateErrors) {
    errors[`answer${id}`] = updateErrors
    context.setErrors(errors)
    return redirect(context, `/question/${context.body.questionId}/edit`)
  }
  context.setAlert('Answer updated', 'success')
  const redirectUrl = `/question/${context.body.questionId}/edit`
  return redirect(context, redirectUrl)
}
