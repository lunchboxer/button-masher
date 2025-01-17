import { userModel } from '../../../models/userModel.js'
import { setAlert } from '../../../utils/alert.js'
import { redirect } from '../../../utils/redirect.js'
import { studentDetailPage } from './index.html.js'

export const POST = (context, _request, parameters) => {
  const { data: student, errors } = userModel.remove(parameters.id)
  if (errors) {
    return context.sendPage(studentDetailPage, {
      student,
      errors,
    })
  }
  setAlert(
    context,
    `Student "${student.name}" removed successfully.`,
    'success',
  )
  return redirect(context, '/student')
}
