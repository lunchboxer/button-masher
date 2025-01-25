import { questionGroupModel } from '../../../models/questionGroupModel.js'
import { html } from '../../../utils/html.js'
import { redirect } from '../../../utils/redirect.js'
import { updateQuestionGroupSchema } from '../../../utils/validation-schemas.js'
import { validate } from '../../../utils/validation.js'
import { layout } from '../../_layout.html.js'

const title = 'Edit Question Group'

const content = ({ questionGroup = {}, errors = {} }) => html`

<h2>Edit Question Group</h2>

<form method="post">
  <label for="name-input">Name</label>
  <input type="text" name="name" id="name-input" value="${questionGroup.name}" required minlength="3" maxlength="50" />
  ${errors.name && html`<p class="error">${errors.name}</p>`}

  <label for="description-input">Description</label>
  <textarea name="description" id="description-input">${questionGroup.description}</textarea>
  ${errors.description && html`<p class="error">${errors.description}</p>`}

  <div class="button-group">
    <a href="/question-group/${questionGroup.id}" class="button">Cancel</a>
    <input type="submit" class="button" value="Save" />
  </div>
</form>
`

const editQuestionGroupPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: questionGroup, errors } = questionGroupModel.get(parameters.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return context.sendPage(editQuestionGroupPage, { questionGroup })
}

export const POST = (context, _request, parameters) => {
  const { isValid, errors: validationErrors } = validate(
    { ...context.body, id: parameters.id },
    updateQuestionGroupSchema,
  )
  if (!isValid) {
    context.setErrors(validationErrors)
    return redirect(context, `/question-group/${parameters.id}/edit`)
  }
  const { errors: updateErrors } = questionGroupModel.update(
    parameters.id,
    context.body,
  )
  if (updateErrors) {
    context.setErrors(updateErrors)
    return redirect(context, `/question-group/${parameters.id}/edit`)
  }
  context.setAlert(
    `Question group "${context.body.name}" updated successfully.`,
    'success',
  )
  return redirect(context, `/question-group/${parameters.id}`)
}
