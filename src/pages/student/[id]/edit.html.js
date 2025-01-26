import { passwordDots } from '$/components/password-dots.html.js'
import { userModel } from '$/models/userModel.js'
import { html } from '$/utils/html.js'
import { redirect } from '$/utils/redirect.js'
import { updateStudentSchema } from '$/utils/validation-schemas.js'
import { validate } from '$/utils/validation.js'
import { layout } from '../../_layout.html.js'

const title = 'Edit Student'

const content = ({ student = {}, errors = {} }) => html`

<h2>Edit Student</h2>

<form method="post">

  <label for="name-input">Name</label>
  <input type="text" id="name-input" name="name" value="${student.name}" />
  ${errors.name && html`<p class="error">${errors.name}</p>`}

  <label for="student-password-input">Password</label>
  <input type="text" id="student-password-input" name="password" required minlength="4" maxlength="8"
    pattern="^(?!.*(www|ppp))[rgbwyp]{4,8}(?<![wp])$" value="${student.username}"
    title="Only characters r, g, b, w, y, and p are allowed. Minimum 4 characters, maximum 8. Sequences 'www' and 'ppp' are not allowed. Passwords cannot end with 'w' or 'p'." />
  ${
    (errors.password || errors.username) &&
    html`

  <p class="error">${errors.password || errors.username}</p>
  `
  }
  ${passwordDots(student.username)}

  <div class="button-group">
    <button type="reset" class="button">Reset</button>
    <input type="submit" class="button" value="Save" />
  </div>
</form>
<script src="/public/colored-dots.js" defer></script>
`

const editStudentPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: student, errors } = userModel.get(parameters.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return context.sendPage(editStudentPage, { student })
}

export const POST = async (context, _request, parameters) => {
  const { isValid, errors: validationErrors } = validate(
    { ...context.body, id: parameters.id },
    updateStudentSchema,
  )
  if (!isValid) {
    context.setErrors(validationErrors)
    return redirect(context, `/student/${parameters.id}/edit`)
  }
  const updateData = { ...context.body, username: context.body.password }
  const { errors } = await userModel.update(parameters.id, updateData)
  if (errors) {
    context.setErrors(errors)
    return redirect(context, `/student/${parameters.id}/edit`)
  }
  context.setAlert(
    `Student "${context.body.name}" updated successfully.`,
    'success',
  )
  return redirect(context, `/student/${parameters.id}`)
}
