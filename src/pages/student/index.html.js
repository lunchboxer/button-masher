import { passwordDots } from '../../components/password-dots.html.js'
import { userModel } from '../../models/userModel.js'
import { html } from '../../utils/html.js'
import { layout } from '../_layout.html.js'

const title = 'Students'

const userList = students => html`

<p>Found ${students.length} students</p>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Password</th>
      <th>Login dots</th>
    </tr>
  </thead>
  <tbody>
    ${students
      .map(
        student => html`
    <tr>
      <td><a href="/student/${student.id}">${student.name}</a></td>
      <td>${student.username}</td>
      <td class="student-password">${passwordDots(student.username)}</td>
    </tr>
    `,
      )
      .join('')}
  </tbody>
</table>
`

const content = ({ students }) => html`

<h2>Students</h2>

${students.length === 0 ? html`<p>No students found</p>` : userList(students)}

<a class="button" href="/student/add">Add a Student</a>

<style>
  .student-password #password-dots div {
    height: .6em;
    width: .6em;
    margin: 0.1rem;
  }
</style>
`

const allStudentsPage = data => layout({ title, content, data })

export const GET = (context, _request) => {
  const { data: students, errors } = userModel.list('student')
  if (errors) {
    throw new Error(errors.all)
  }
  return context.sendPage(allStudentsPage, { students })
}
