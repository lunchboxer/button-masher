import { html } from '../../../utils/html.js'
import { layout } from '../../_layout.html.js'
import { questionGroupModel } from '../../../models/questionGroupModel.js'

const title = 'Question Group'

const content = ({ questionGroup = {} }) => html`

<h2>${questionGroup.name}</h2>

<h3>Questions</h3>

`

const homePage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: questionGroup, errors } = questionGroupModel.get(parameters.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return context.sendPage(homePage, { questionGroup })
}
