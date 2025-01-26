import { questionModel } from '$/models/questionModel.js'
import { removeFragments } from '$/utils/sse-helpers.js'

export const DELETE = (context, _request, parameters) => {
  const { id } = parameters
  questionModel.remove(id)
  const stream = removeFragments(`#question-${id}`)
  return context.sendSse(stream)
}
