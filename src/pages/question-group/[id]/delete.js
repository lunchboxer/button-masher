import { questionGroupModel } from '../../../models/questionGroupModel.js'
import { redirect } from '../../../utils/redirect.js'

export const POST = (context, _request, parameters) => {
  const { data: questionGroup, errors } = questionGroupModel.remove(
    parameters.id,
  )
  if (errors) {
    context.setErrors(errors)
    return redirect(context, `/question-group/${parameters.id}`)
  }
  context.setAlert(
    `Question group "${questionGroup.name}" deleted successfully.`,
    'success',
  )
  return redirect(context, '/question-group')
}
