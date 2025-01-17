import { questionGroupModel } from '../../models/questionGroupModel.js'
import { html } from '../../utils/html.js'
import { layout } from '../_layout.html.js'

const title = 'Question Groups'

const content = ({ questionGroups }) => html`
<h1>Question Group</h1>
${
  questionGroups.length === 0
    ? html`<p>No question groups found</p>`
    : html`

<p>Found ${questionGroups.length} question groups</p>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    ${questionGroups
      .map(
        questionGroup => html`
    <tr>
      <td><a href="/question-group/${questionGroup.id}">${questionGroup.name}</a></td>
      <td>${questionGroup.description || '-'}</td>
    </tr>
    `,
      )
      .join('')}
  </tbody>
</table>
`
}

<a class="button" href="/question-group/create">Create New Question Group</a>
`

const questionGroupPage = data => layout({ title, content, data })

export const GET = context => {
  const { data: questionGroups, errors } = questionGroupModel.list()
  return context.sendPage(questionGroupPage, {
    questionGroups,
    errors,
  })
}
