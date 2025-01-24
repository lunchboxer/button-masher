import { questionGroupModel } from '../../../models/questionGroupModel.js'
import { setAlert } from '../../../utils/alert.js'
import { redirect } from '../../../utils/redirect.js'
import { questionGroupPage } from './index.html.js'

export const POST = (context, _request, parameters) => {
  const { data: questionGroup, errors } = questionGroupModel.remove(
    parameters.id,
  )
  if (errors) {
    return context.sendPage(questionGroupPage, {
      questionGroup,
      errors,
    })
  }
  setAlert(
    context,
    `Question group "${questionGroup.name}" deleted successfully.`,
    'success',
  )
  return redirect(context, '/question-group')
}
