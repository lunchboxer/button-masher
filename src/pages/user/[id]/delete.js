import { userModel } from '$/models/userModel.js'
import { redirect } from '$/utils/redirect.js'

export const POST = (context, _request, parameters) => {
  const { data: user, errors } = userModel.remove(parameters.id)
  if (errors) {
    context.setErrors(errors)
    return redirect(context, `/user/${parameters.id}`)
  }
  context.setAlert(`User "${user.username}" deleted successfully.`, 'success')
  return redirect(context, '/user')
}
