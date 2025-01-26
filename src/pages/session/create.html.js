import { html } from '../../utils/html.js'
import { layout } from '../_layout.html.js'

const title = 'Create Session'

const content = data => html`
<h2>Create Session</h2>

<form method="POST" action="/session/create">
  <label for="questionGroupId">Question Group ID</label>
  <input type="text" name="questionGroupId" id="questionGroupId" value="${data.questionGroupId}" />
  <label for="startTime">Start Time</label>
  <input type="datetime-local" name="startTime" id="startTime" value="${data.startTime}" />
  <label for="endTime">End Time</label>
  <input type="datetime-local" name="endTime" id="endTime" value="${data.endTime}" />

  <div class="button-group">
    <a href="/session" class="button">Cancel</a>
    <button type="submit" class="button">Create Session</button>
  </div>
</form>
`

const sessionCreatePage = data => layout({ title, content, data })

export const GET = context => context.sendPage(sessionCreatePage)
