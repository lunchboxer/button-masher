import { html } from '../utils/html.js'

export const questionListItem = ({ question = {}, referrer }) => html`

<details id="question-${question.id}">
  <summary class="question">${question.questionText}</summary>
  ${
    question.answers && question.answers.length > 0
      ? html`
  <ul class="answers-list">
    ${question.answers
      .map(
        answer => html`<li ${answer.isCorrect && 'class="correct"'}>${answer.answerText}</li>
    `,
      )
      .join('')}
  </ul>
  `
      : html`
  <p>No answers yet.</p>
  `
  }
  </ol>
  <div class="button-group">
    <a href="/question/${question.id}/edit" class="button">Edit</a>
    <button class="button" data-open-modal="delete-question-${question.id}">Delete</button>
  </div>
</details>

<dialog id="delete-question-${question.id}">
  <h3>Confirm Delete</h3>
  <p>Are you sure you want to delete the question "${question.questionText}"? This action cannot be undone. All related
    answers will also be deleted.</p>
  <form method="dialog">
    <input value="Yes, Delete" type="submit" class="button"
      formaction="/question/${question.id}/delete?referrer=${encodeURIComponent(referrer)}" formmethod="post" />
    <button type="submit" class="button">Cancel</button>
  </form>
</dialog>
<style>
  .answers-list li {
    color: var(--error-color);
  }

  .answers-list li.correct {
    color: var(--success-color);
  }
</style>

`
