import { questionGroupModel } from '../../models/questionGroupModel.js'
import { sessionModel } from '../../models/sessionModel.js'
import { html } from '../../utils/html.js'
import { redirect } from '../../utils/redirect.js'
import { layout } from '../_layout.html.js'

const title = 'Sessions'

const content = ({ questionGroups, sessions, activeSession }) => html`

<h2>Sessions</h2>

${
  activeSession &&
  html`
<p>There is an active session. <a href="/quiz">Join the quiz now!</a></p>
`
}

<h3>Start a quiz session</h3>
<form method="post">
  <select name="questionGroupId" id="questionGroupId">
    ${questionGroups.map(
      questionGroup => html`
    <option value="${questionGroup.id}">${questionGroup.name}</option>
    `,
    )}
  </select>
  <div class="button-group">
    <input type="submit" class="button" value="Start" />
  </div>
</form>

<h3>All Sessions</h3>
${
  sessions.length > 0
    ? html`
<table>
  <thead>
    <tr>
      <th>Question Group</th>
      <th>Leader</th>
      <th>Start Time</th>
      <th>End Time</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    ${sessions.map(
      session => html`
    <tr>
      <td>${session.questionGroupName}</td>
      <td>${session.leaderUsername}</td>
      <td>${new Date(session.startTime).toLocaleString()}</td>
      <td>${session.endTime ? new Date(session.endTime).toLocaleString() : '--'}</td>
      <td>
        <a href="/session/${session.id}" class="button">View</a>
      </td>
    </tr>
    `,
    )}
  </tbody>
</table>
`
    : html`<p>No sessions found.</p>`
}

`

const sessionPage = data => layout({ title, content, data })

export const GET = async context => {
  const { data: questionGroups } = questionGroupModel.list()
  const { data: sessions } = sessionModel.list()

  const now = new Date()
  const activeSession = sessions.find(
    session => new Date(session.startTime) <= now && session.endTime === null,
  )

  return context.sendPage(sessionPage, {
    sessions,
    activeSession,
    questionGroups,
  })
}

export const POST = context => {
  const { id: leaderId } = context.user
  const { questionGroupId } = context.body
  const { errors } = sessionModel.create({
    leaderId,
    questionGroupId,
    startTime: new Date(),
  })
  if (errors) {
    context.setErrors(errors)
    context.setAlert('Error starting session', 'error')
    return redirect(context, '/session')
  }
  context.setAlert('Session started', 'success')
  return redirect(context, '/session')
}
