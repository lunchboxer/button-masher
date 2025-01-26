import { layout } from '$/pages/_layout.html.js'
import { html } from '$/utils/html.js'

const title = 'Session details'

const content = html`

<h2>${title}</h2>
<p>This is the session details page.</p>

`

const sessionDetailsPage = data => layout({ content, title, data })

export const GET = context => context.sendPage(sessionDetailsPage)
