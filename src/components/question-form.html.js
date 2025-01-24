import { html } from '../utils/html.js'

export const questionForm = ({
  question = {},
  questionGroupId,
  errors = {},
  referrer,
}) => html`

<form method="post">
  ${referrer && html`<input type="hidden" name="referrer" value="${referrer}" />`}

  ${
    questionGroupId &&
    html`<input type="hidden" name="questionGroupId" value="${questionGroupId}" />`
  }

  <label for="text-input">Question text</label>
  <input type="text" id="text-input" name="questionText" value="${question.questionText}" required minlength="3"
    maxlength="100" />
  ${
    errors.questionText &&
    html`

  <p class="error">${errors.questionText}</p>

  `
  }

  <h3>Answers</h3>
  ${errors.answers && html`<p class="error">${errors.answers}</p>`}
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Correct</th>
        <th>Answer</th>
      </tr>
    </thead>
    <tbody>
      ${[0, 1, 2, 3, 4, 5]
        .map(
          i => html`
      <tr>
        <td>${i + 1}</td>
        <td valign="center" align="center">
          <input type="checkbox" id="correct${i || '0'}" name="correct${i || '0'}" ${
            question?.answers?.[i]?.isCorrect && 'checked'
          } value="correct" />

        </td>
        <td><input type="text" name="answer${i || '0'}" value="${question?.answers?.[i]}" maxlength="100" /></td>
      </tr>
      `,
        )
        .join('')}
    </tbody>
  </table>

  <div class="button-group">
    <a href="/question-group/${questionGroupId}" class="button">Cancel</a>
    <input type="submit" class="button" value="Save" />
  </div>
</form>
`
