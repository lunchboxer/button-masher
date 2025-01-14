import { html } from '../utils/html.js'
import { themeSwitcher } from './theme-switcher.html.js'

export const footer = html`
<footer>
  <p>made with 💖 by james | <span class="icp">湘ICP备20004695号-1</span></p>
  ${themeSwitcher}
</footer>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
  }

  footer p {
    font-size: 0.8rem;
  }

  footer .icp {
    font-size: 0.7rem;
  }

  footer
</style>
`
