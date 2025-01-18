import { setAlert } from '../utils/alert.js'
import { html } from '../utils/html.js'
import { layout } from './_layout.html.js'

const title = 'Home'

const content = () => html`

<h1>Welcome Button Masher.</h1>

<form method="POST">
  <button class="button">Show a notification</button>
</form>

`

const notifyPage = data => layout({ title, content, data })

export const GET = context => context.sendPage(notifyPage)

export const POST = context => {
  setAlert(
    context,
    'This text notification, which is quite long, was created without problems.',
    'success',
  )
  return context.sendPage(notifyPage)
}
