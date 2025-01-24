import { questionModel } from '../../../models/questionModel.js'
import { setAlert } from '../../../utils/alert.js'
import { redirect } from '../../../utils/redirect.js'

export const POST = (context, _request, parameters) => {
  const { data: question, errors } = questionModel.remove(parameters.id)
  if (errors) {
    setAlert(context, errors.all, 'error')
    return redirect(context, parameters.referrer)
  }
  setAlert(
    context,
    `Question "${question.questionText}" removed successfully.`,
    'success',
  )
  return redirect(context, parameters.referrer)
}
