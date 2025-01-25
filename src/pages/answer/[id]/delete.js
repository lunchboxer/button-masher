import { answerModel } from '../../../models/answerModel.js'
import { redirect } from '../../../utils/redirect.js'

export const POST = (context, _request, parameters) => {
  const { id, questionId } = parameters
  const { errors: deleteErrors } = answerModel.remove(id)
  if (deleteErrors) {
    context.setErrors(deleteErrors)
    return redirect(context, `/question/${questionId}/edit`)
  }
  context.setAlert('Answer deleted', 'success')
  return redirect(context, `/question/${questionId}/edit`)
}
