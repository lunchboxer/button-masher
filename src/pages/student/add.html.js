import { passwordDots } from '../../components/password-dots.html.js'
import { userModel } from '../../models/userModel.js'
import { generateValidPassword } from '../../utils/generate-student-password.js'
import { html } from '../../utils/html.js'
import { redirect } from '../../utils/redirect.js'
import { createStudentSchema } from '../../utils/validation-schemas.js'
import { validate } from '../../utils/validation.js'
import { layout } from '../_layout.html.js'

const title = 'Add a student'

const content = ({ password, name, errors = {} }) => {
  const generatedPassword = generateValidPassword()
  return html`

<h2>Add a student</h2>

<form method="post">
  <label for="name-input">Name</label>
  <input type="text" name="name" id="name-input" required value="${name}" />
  ${
    errors.name &&
    html`

  <p class="error">${errors.name}</p>

  `
  }

  <label for="student-password-input">Password</label>
  <input type="text" id="student-password-input" name="password" required minlength="4" maxlength="8"
    pattern="^(?!.*(www|ppp))[rgbwyp]{4,8}(?<![wp])$" value="${password || generatedPassword}"
    title="Only characters r, g, b, w, y, and p are allowed. Minimum 4 characters, maximum 8. Sequences 'www' and 'ppp' are not allowed. Passwords cannot end with 'w' or 'p'." />
  ${
    (errors.password || errors.username) &&
    html`

  <p class="error">${errors.password || errors.username}</p>

  `
  }
  ${passwordDots(generatedPassword)}

  <div class="button-group">
    <a href="/student" class="button">Cancel</a>
    <input type="submit" class="button" value="Save" />
  </div>
</form>
<script src="/public/colored-dots.js" defer></script>
`
}
const createStudentPage = data => layout({ title, content, data })

export const GET = (context, _request) => context.sendPage(createStudentPage)

export const POST = async (context, _request) => {
  const { isValid, errors: validationErrors } = validate(
    context.body,
    createStudentSchema,
  )
  if (!isValid) {
    return context.sendPage(createStudentPage, {
      ...context.body,
      errors: validationErrors,
    })
  }

  const newUserData = {
    ...context.body,
    role: 'student',
    email: null,
    username: context.body.password,
  }
  const { data: user, errors } = await userModel.create(newUserData)
  if (errors) {
    return context.sendPage(createStudentPage, {
      ...context.body,
      errors,
    })
  }
  context.setAlert(
    `Student "${context.body?.name}" added successfully.`,
    'success',
  )
  return redirect(context, `/student/${user.id}`)
}
