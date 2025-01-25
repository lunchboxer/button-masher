import { html } from '../utils/html.js'
import saveIcon from './icons/save.svg'
import xIcon from './icons/x.svg'

export const answerEditForm = ({ answer, index, questionId, errors }) => html`

<form method="post" action="/answer/${answer.id}/edit" class="inline">
  <tr>
    <td>${index + 1}</td>
    <td valign="center" align="center">
      <input type="hidden" name="questionId" value="${questionId}">
      <input type="hidden" name="isCorrect" value="0">
      <input type="checkbox" name="isCorrect" ${answer.isCorrect && 'checked'} value="1" />
    </td>
    <td>
      <input type="text" name="answerText" value="${answer.answerText}" maxlength="100" />
      ${
        errors[`answer${answer.id}`]?.answerText &&
        html`<p class="error">${errors[`answer${answer.id}`]?.answerText}
      </p>`
      }
    </td>
    <td>
      <div style="display:flex; gap: 0.5rem;">
        <button type="submit" class="icon-button">${saveIcon}</button>
        <button data-open-modal="delete-answer-${answer.id}" class="icon-button">${xIcon}</button>
      </div>
    </td>
  </tr>
</form>
<dialog id="delete-answer-${answer.id}">
  <h3>Confirm Delete</h3>
  <p>Are you sure you want to delete the answer "${answer.answerText}"? This action cannot be undone.</p>
  <form method="dialog">
    <input value="Yes, Delete" type="submit" class="button"
      formaction="/answer/${answer.id}/delete?questionId=${questionId}" formmethod="post" />
    <button type="submit" class="button">Cancel</button>
  </form>
</dialog>
`
