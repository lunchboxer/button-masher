import { questionModel } from '$/models/questionModel.js'
import { html } from '$/utils/html.js'
import { mergeFragments, mergeSignals } from '$/utils/sse-helpers.js'

const questionEditForm = ({ question = {}, errors = {} }) => html`

<div id="question-${question.id}">
  <label for="text-input">Question text</label>
  <input data-on-keydown__window="evt.key == 'Enter' && @patch('/ds/question/${question.id}')" ${
    errors.questionText && 'class="error"'
  } type="text" id="text-input" data-bind="questionText" minlength="3" maxlength="100" />

  <button class="button" data-on-click="@get('/ds/question/${question.id}/edit?cancel=true')">Cancel</button>
  <button class="button" data-on-click="@patch('/ds/question/${question.id}')">Save</button>

  ${
    errors.questionText &&
    html`

  <p class="error">${errors.questionText}</p>

  `
  }
</div>
`

export const GET = (context, _request, parameters) => {
  const { data: question, error: getError } = questionModel.get(parameters.id)
  if (getError) {
    // not real sure what I want to do with errors in this case.
    return
  }
  const selector = `#question-${parameters.id}`
  const fragments = questionEditForm(question)
  const stream = mergeFragments({ selector, fragments })
  const stream2 = mergeSignals({
    signals: { questionText: question.questionText },
  })
  return context.sendSse([stream, stream2])
}
