import { html } from '../../utils/html.js'
import { layout } from '../_layout.html.js'

const title = 'Sessions'

const content = () => html`

<h2>Sessions</h2>


`

const sessionPage = data => layout({ title, content, data })

export const GET = context => context.sendPage(sessionPage)
