import { questionModel } from '$/models/questionModel.js'
import { redirect } from '$/utils/redirect.js'

export const POST = (context, _request, parameters) => {
  const { data: question, errors } = questionModel.remove(parameters.id)
  if (errors) {
    context.setErrors(errors)
    return redirect(context, parameters.referrer)
  }
  context.setAlert(
    `Question "${question.questionText}" removed successfully.`,
    'success',
  )
  return redirect(context, parameters.referrer)
}
