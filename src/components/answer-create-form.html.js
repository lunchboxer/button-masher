import { html } from '../utils/html.js'
import saveIcon from './icons/save.svg'

export const answerCreateForm = ({ index, questionId, answer = {} }) => html`

<form method="post" class="inline" action="/answer/create">
  <tr>
    <td>${index + 1}</td>
    <td valign="center" align="center">
      <input type="hidden" name="questionId" value="${questionId}">
      <input type="hidden" name="isCorrect" value="0">
      <input type="checkbox" name="isCorrect" ${answer.isCorrect && 'checked'}
        value="1" />
    </td>
    <td>
      <input type="text" name="answerText" value="${answer.answerText}" maxlength="100" />
    </td>
    <td>
      <button class="icon-button" type="submit">${saveIcon}</button>
    </td>
  </tr>
</form>
`
