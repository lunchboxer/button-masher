import { html } from '../utils/html.js'
import circleIcon from './icons/circle.svg'

export const logoAndTitle = html`
<a class="title-link" id="main-title" href="/">
  <span class="logo">
    ${circleIcon}
  </span>
  <h1 class="title">Button Masher</h1>
</a>
`
