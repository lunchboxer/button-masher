import { passwordDots } from '$/components/password-dots.html.js'
import { userModel } from '$/models/userModel.js'
import { html } from '$/utils/html.js'
import { layout } from '../../_layout.html.js'

const title = 'Student Details'

const content = ({ student = {} }) => html`
<h2>Student Details</h2>

<dl>
  <dt>Name</dt>
  <dd>${student.name || '-'}</dd>
  <dt>Password</dt>
  <dd>${student.username}</dd>
  <dt>Login dots</dt>
  <dd class="medium-dots">${passwordDots(student.username)}</dd>
  <dt>ID</dt>
  <dd>${student.id}</dd>
</dl>
<div class="button-group start">
  <a class="button" href="/student/${student.id}/edit">Edit</a>
  <button id="delete-user-button" class="button">Delete</button>
</div>

<dialog id="deleteModal">
  <h3>Confirm Delete</h3>
  <p>Are you sure you want to delete the student "${student.username}"? This action cannot be undone.</p>
  <form method="dialog">
    <input value="Yes, Delete" type="submit" class="button" formaction="/student/${student.id}/delete"
      formmethod="post" />
    <button type="submit" class="button">Cancel</button>
  </form>
</dialog>

<style>
  .medium-dots #password-dots {
    padding: 0.2rem 0;
  }

  .medium-dots #password-dots div {
    width: 1.3rem;
    height: 1.3rem;
  }
</style>
`

export const studentDetailPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: student, errors } = userModel.get(parameters.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return context.sendPage(studentDetailPage, { student })
}
