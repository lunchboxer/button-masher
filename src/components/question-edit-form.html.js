import { html } from '../utils/html.js'

export const questionEditForm = ({ question = {}, errors = {} }) => html`

<form method="post">

  <label for="text-input">Question text</label>
  <input type="text" id="text-input" name="questionText" value="${question.questionText}" required minlength="3"
    maxlength="100" />
  ${
    errors.questionText &&
    html`

  <p class="error">${errors.questionText}</p>

  `
  }

  <div class="button-group">
    <a href="/question-group/${question.questionGroupId}" class="button">Cancel</a>
    <input type="submit" class="button" value="Save" />
  </div>
</form>
`
