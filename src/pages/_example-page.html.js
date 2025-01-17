import { html } from '../utils/html.js'
import { layout } from './_layout.html.js'

const title = 'Home'

const content = ({ foo }) => html`

<h1>Welcome ${foo} Button Masher.</h1>

`

const homePage = data => layout({ title, content, data })

export const GET = context => {
  const data = { foo: 'bar' }
  return context.sendPage(homePage, data)
}
