import { answerModel } from '../../models/answerModel.js'
import { setAlert } from '../../utils/alert.js'
import { redirect } from '../../utils/redirect.js'
import { createAnswerSchema } from '../../utils/validation-schemas.js'
import { validate } from '../../utils/validation.js'

export const POST = (context, _request, _parameters) => {
  const { isValid, errors: validationErrors } = validate(
    context.body,
    createAnswerSchema,
  )

  if (!isValid) {
    redirect(context, `/question/${context.body.questionId}/edit`, 302, {
      errors: validationErrors,
    })
  }
  const { errors: creationErrors } = answerModel.create(context.body)
  if (creationErrors) {
    redirect(context, `/question/${context.body.questionId}/edit`, 302, {
      errors: creationErrors,
    })
  }
  setAlert(context, 'Answer created successfully', 'success')
  return redirect(context, `/question/${context.body.questionId}/edit`)
}
