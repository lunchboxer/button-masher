import { questionListItem } from '../../../components/question-list-item.html.js'
import { questionGroupModel } from '../../../models/questionGroupModel.js'
import { html } from '../../../utils/html.js'
import { sanitizeObject } from '../../../utils/sanitize.js'
import { layout } from '../../_layout.html.js'

const title = 'Question Group'

const content = ({ questionGroup = {} }) => {
  const referrer = `/question-group/${questionGroup.id}`
  return html`

<h2>${questionGroup.name}</h2>

<p>${questionGroup.description || '<em>No description</em>'}</p>

<h3>Questions</h3>

<ul>
  ${
    questionGroup.questions?.length > 0
      ? html`
  ${questionGroup.questions
    .map(question =>
      questionListItem({
        question,
        referrer,
      }),
    )
    .join('')}
  `
      : html`
  <li>No questions yet.</li>
  `
  }
</ul>
<a class="button"
  href="/question/create?referrer=${encodeURIComponent(referrer)}&questionGroupId=${encodeURIComponent(questionGroup.id)}">
  Add a question
</a>
<a class="button" href="/question-group/${questionGroup.id}/edit">Edit Question
  Group</a>
<button class="button" data-open-modal="deleteQuestionGroupModal">Delete Question Group</button>

<dialog id="deleteQuestionGroupModal">
  <h3>Confirm Delete</h3>
  <p>Are you sure you want to delete the question group "${questionGroup.name}"? This action cannot be undone.</p>
  <form method="dialog">
    <input value="Yes, Delete" type="submit" class="button" formaction="/question-group/${questionGroup.id}/delete"
      formmethod="post" />
    <button type="submit" class="button">Cancel</button>
  </form>
</dialog>

`
}

export const questionGroupPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: questionGroupRaw, errors } = questionGroupModel.get(
    parameters.id,
  )
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  const questionGroup = sanitizeObject(questionGroupRaw)
  return context.sendPage(questionGroupPage, { questionGroup })
}
