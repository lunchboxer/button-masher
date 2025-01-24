import { answerModel } from '../../../models/answerModel.js'
import { questionModel } from '../../../models/questionModel.js'
import { setAlert } from '../../../utils/alert.js'
import { redirect } from '../../../utils/redirect.js'
import { editQuestionPage } from '../../question/[id]/edit.html.js'

export const POST = (context, _request, parameters) => {
  const { id, questionId } = parameters
  const { errors: deleteErrors } = answerModel.remove(id)
  if (deleteErrors) {
    const { data: question } = questionModel.get(questionId)
    return context.sendPage(editQuestionPage, {
      question,
      errors: deleteErrors,
    })
  }
  setAlert(context, 'Answer deleted', 'success')
  return redirect(context, `/question/${questionId}/edit`)
}
