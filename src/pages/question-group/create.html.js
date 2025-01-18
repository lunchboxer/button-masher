import { questionGroupModel } from '../../models/questionGroupModel.js'
import { setAlert } from '../../utils/alert.js'
import { html } from '../../utils/html.js'
import { redirect } from '../../utils/redirect.js'
import { createQuestionGroupSchema } from '../../utils/validation-schemas.js'
import { validate } from '../../utils/validation.js'
import { layout } from '../_layout.html.js'

const title = 'Create Question Group'

const content = ({ errors = {}, questionGroup = {} }) => html`

<h1>Create Question Group</h1>

<form method="POST">
  <label for="name-input">Name</label>
  <input type="text" name="name" id="name-input" value="${questionGroup.name}" required />
  ${errors.name && html`<p class="error">${errors.name}</p>`}

  <label for="description-input">Description</label>
  <textarea name="description" id="description-input">${questionGroup.description}</textarea>
  ${errors.description && html`<p class="error">${errors.description}</p>`}


  <div class="button-group">
    <a class="button" href="/question-group">Cancel</a>
    <button type="submit" class="button">Create</button>
  </div>
</form>
`

const createQuestionGroupPage = data => layout({ title, content, data })

export const GET = context => context.sendPage(createQuestionGroupPage)

export const POST = context => {
  const { isValid, errors: validationErrors } = validate(
    context.body,
    createQuestionGroupSchema,
  )
  if (!isValid) {
    return context.sendPage(createQuestionGroupPage, {
      errors: validationErrors,
      questinoGroup: context.body,
    })
  }
  const { data: questionGroup, errors } = questionGroupModel.create(
    context.body,
  )
  if (errors) {
    return context.sendPage(createQuestionGroupPage, {
      errors,
      questionGroup: context.body,
    })
  }
  setAlert(
    context,
    `Question group "${context.body.name}" created successfully.`,
  )
  return redirect(context, `/question-group/${questionGroup.id}`)
}
