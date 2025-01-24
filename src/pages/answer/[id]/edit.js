import { answerModel } from '../../../models/answerModel.js'
import { setAlert } from '../../../utils/alert.js'
import { redirect } from '../../../utils/redirect.js'
import { updateAnswerSchema } from '../../../utils/validation-schemas.js'
import { validate } from '../../../utils/validation.js'

export const POST = (context, _request, parameters) => {
  const { id } = parameters
  const { isValid, errors: validationErrors } = validate(
    context.body,
    updateAnswerSchema,
  )

  if (!isValid) {
    redirect(context, `/question/${context.body.questionId}/edit`, 302, {
      errors: validationErrors,
    })
  }
  const { errors: updateErrors } = answerModel.update(id, context.body)
  if (updateErrors) {
    redirect(context, `/question/${context.body.questionId}/edit`, 302, {
      errors: updateErrors,
    })
  }
  setAlert(context, 'Answer updated', 'success')
  const redirectUrl = `/question/${context.body.questionId}/edit`
  return redirect(context, redirectUrl)
}
