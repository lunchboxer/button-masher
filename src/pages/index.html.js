import { html } from '../utils/html.js'
import { layout } from './_layout.html.js'

const title = 'Home'

const headExtras = data => {
  if (!data.user) {
    return html`

<link rel="prefetch" href="/auth/login">
<link rel="prefetch" href="/auth/profile">

`
  }
}

const content = () => html`

<h1>Welcome Button Masher.</h1>

`

const homePage = data =>
  layout({ title, content, data, headExtras: headExtras(data) })

export const GET = context => context.sendPage(homePage)
