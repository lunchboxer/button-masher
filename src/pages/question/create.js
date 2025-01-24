import { questionForm } from '../../components/question-form.html.js'
import { questionModel } from '../../models/questionModel.js'
import { setAlert } from '../../utils/alert.js'
import { html } from '../../utils/html.js'
import { redirect } from '../../utils/redirect.js'
import { addQuestionWithAnswersSchema } from '../../utils/validation-schemas.js'
import { validate } from '../../utils/validation.js'
import { layout } from '../_layout.html.js'

const title = 'Add a question'

const content = ({
  question = {},
  questionGroupId,
  errors = {},
  referrer,
}) => html`

<h2>Add a question</h2>

${questionForm({ question, questionGroupId, errors, referrer })}

`
const addQuestionPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { referrer, questionGroupId } = parameters
  return context.sendPage(addQuestionPage, { referrer, questionGroupId })
}

export const POST = (context, _request, parameters) => {
  const question = {
    questionGroupId: context.body.questionGroupId,
    questionText: context.body.questionText,
    answers: [],
  }

  for (let i = 0; i <= 5; i++) {
    const answerKey = `answer${i}`
    const correctKey = `correct${i}`
    if (context.body[answerKey]) {
      question.answers.push({
        answerText: context.body[answerKey],
        isCorrect: context.body[correctKey] === 'correct',
      })
    }
  }
  const { errors: validationErrors } = validate(
    context.body,
    addQuestionWithAnswersSchema,
  )
  const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect)
  if (!hasCorrectAnswer) {
    validationErrors.answers = 'At least one answer should be marked correct'
  }

  if (validationErrors.length > 0) {
    return context.sendPage(addQuestionPage, {
      questionGroupId: context.body.questionGroupId,
      errors: validationErrors,
      question: context.body,
    })
  }
  const { errors: createErrors } = questionModel.create(question)
  if (createErrors) {
    return context.sendPage(addQuestionPage, {
      questionGroup: context.body.questionGroupId,
      errors: createErrors,
      question: context.body,
    })
  }

  setAlert(context, 'Question added', 'success')
  const referrer = parameters.referrer || '/question/'
  return redirect(context, referrer)
}
