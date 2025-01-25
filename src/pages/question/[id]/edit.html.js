import { answerCreateForm } from '../../../components/answer-create-form.html.js'
import { answerEditForm } from '../../../components/answer-edit-form.html.js'
import { questionEditForm } from '../../../components/question-edit-form.html.js'
import { questionModel } from '../../../models/questionModel.js'
import { html } from '../../../utils/html.js'
import { redirect } from '../../../utils/redirect.js'
import { updateQuestionSchema } from '../../../utils/validation-schemas.js'
import { validate } from '../../../utils/validation.js'
import { layout } from '../../_layout.html.js'

const title = 'Edit Question'

const content = ({ question = {}, errors }) => html`

<h2>Edit question</h2>

${questionEditForm({ question, errors })}

<h3>Answers</h3>
${errors.answers && html`<p class="error">${errors.answers}</p>`}
<table class="tight-table">
  <tbody>
    ${Array.from({ length: 6 })
      .map((_, index) => {
        const answer = question.answers?.[index]
        return answer
          ? answerEditForm({ answer, index, questionId: question.id, errors })
          : answerCreateForm({ index, questionId: question.id, errors })
      })
      .join('')}
  </tbody>
</table>
`

export const editQuestionPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: question, errors } = questionModel.get(parameters.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }

  return context.sendPage(editQuestionPage, {
    question,
  })
}

export const POST = (context, _request, parameters) => {
  const { id } = parameters

  const { isValid, errors: validationErrors } = validate(
    context.body,
    updateQuestionSchema,
  )

  if (!isValid) {
    context.setErrors(validationErrors)
    return redirect(context, `/question/${parameters.id}/edit`)
  }
  const { data: question, errors: updateErrors } = questionModel.update(
    id,
    context.body,
  )
  if (updateErrors) {
    context.setErrors(updateErrors)
    return redirect(context, `/question/${parameters.id}/edit`)
  }
  context.setAlert('Question updated', 'success')
  const redirectUrl = `/question/${question.id}/edit`
  return redirect(context, redirectUrl)
}
