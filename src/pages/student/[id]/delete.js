import { userModel } from '$/models/userModel.js'
import { redirect } from '$/utils/redirect.js'

export const POST = (context, _request, parameters) => {
  const { data: student, errors } = userModel.remove(parameters.id)
  if (errors) {
    context.setErrors(errors)
    return redirect(context, `/student/${parameters.id}`)
  }
  context.setAlert(`Student "${student.name}" removed successfully.`, 'success')
  return redirect(context, '/student')
}
