import { html } from '../utils/html.js'

export const passwordDots = password => {
  let dots = html`<div id="password-dots">`
  for (const index in password.split('')) {
    const char = password.split('')[index]
    dots += html`<div class="${char}"></div>`
  }
  dots += html`</div>`
  return dots
}
