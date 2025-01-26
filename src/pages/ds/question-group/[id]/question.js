import { questionForm } from '$/components/question-form.html.js'
import { questionListItem } from '$/components/question-list-item.html.js'
import { questionModel } from '$/models/questionModel.js'
import { html } from '$/utils/html.js'
import { createQuestionSchema } from '$/utils/validation-schemas.js'
import { validate } from '$/utils/validation.js'
import {
  mergeFragments,
  mergeSignals,
  setSseHeaders,
} from '../../../../utils/sse-helpers.js'

const selector = '#question-form'

const originalQuestionForm = ({ path }) => html`
<div id="question-form">
  <button id="add-question-button" class="button"
    data-on-click="@get('${path}')">
    Add a question
  </button>
</div>
`

export const GET = (context, request, parameters) => {
  const path = request.url.split('?')[0]
  const { cancelAdd } = parameters
  let fragments = questionForm({ path })
  setSseHeaders(context)
  if (cancelAdd) {
    fragments = originalQuestionForm({ path })
    const cancelStream = mergeFragments({ selector, fragments })
    const resetInputStream = mergeSignals({ signals: { questionText: '' } })
    return context.sendSse([cancelStream, resetInputStream])
  }
  const stream = mergeFragments({ selector, fragments })
  return new Response(stream, { headers: context.headers })
}

export const POST = (context, request, parameters) => {
  const rerenderWithErrors = (path, errors) => {
    const stream = mergeFragments({
      selector,
      fragments: questionForm({ path, errors }),
    })
    return new Response(stream, { headers: context.headers })
  }

  const path = request.url.split('?')[0]
  const { isValid, errors: validationErrors } = validate(
    context.body,
    createQuestionSchema,
  )
  setSseHeaders(context)
  if (!isValid) {
    return rerenderWithErrors(path, validationErrors)
  }
  const { questionText } = context.body
  const { id: questionGroupId } = parameters
  const { data: question, errors: creationErrors } = questionModel.create({
    questionText,
    questionGroupId,
  })
  if (creationErrors) {
    return rerenderWithErrors(path, creationErrors)
  }
  const stream1 = mergeFragments({
    selector: '#question-list',
    mergeMode: 'append',
    fragments: questionListItem({ question }),
  })
  const resetInputStream = mergeSignals({ signals: { questionText: '' } })
  const removeFormStream = mergeFragments({
    selector,
    fragments: originalQuestionForm({ path }),
  })
  return context.sendSse([stream1, resetInputStream, removeFormStream])
}
