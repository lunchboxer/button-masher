import { html } from '../utils/html.js'
import { layout } from './_layout.html.js'

const title = 'Button Masher'

const button = color => html`
<button class="button special ${color}">
</button>
`
const content = () => html`

<h1>Buttons</h1>

<div class="buttons-mockup">
  <div class="button-grid">
    ${button('green')}
    ${button('red')}
    ${button('blue')}
    ${button('yellow')}
    ${button('white')}
    ${button('pink')}
  </div>
  <led-component message="idle"></led-component>
</div>

<script src="/public/led-component.js" defer></script>
<script src="/public/buttons.js" defer></script>

<style>
  .buttons-mockup {
    --green: light-dark(var(--latte-green), var(--mocha-green));
    --red: light-dark(var(--latte-red), var(--mocha-red));
    --blue: light-dark(var(--latte-blue), var(--mocha-blue));
    --yellow: light-dark(var(--latte-yellow), var(--mocha-yellow));
    --pink: light-dark(var(--latte-pink), var(--mocha-pink));
  }

  .button-grid {
    display: grid;
    width: 100%;
    max-width: 30rem;
    margin: 0 auto;
    align-items: center;
    justify-items: center;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0.5rem;
  }


  .button.special {
    color: var(--background-color);
    border-color: var(--contrastier-bg-color);
    border-width: 4px;
    width: 6.5rem;
    height: 6.5rem;
    border-radius: 50%;
  }

  .button.special.red {
    background-color: var(--red);
  }

  .button.special.green {
    background-color: var(--green);
  }

  .button.special.blue {
    background-color: var(--blue);
  }

  .button.special.yellow {
    background-color: var(--yellow);
  }

  .button.special.pink {
    background-color: var(--pink);
  }

  .button.special.white {
    background-color: #FFFFFF;
    color: #111;
  }

  .button.special:hover {
    filter: brightness(110%);
  }

  .button.special:active {
    transform: translateY(3px);
  }

  @media (min-width: 576px) {
    .button-grid {
      margin: 1rem auto;
    }

    .button.special {
      width: 8rem;
      height: 8rem;
      border-width: 6px;
      font-size: 1.5rem;
    }
</style>


`

export const buttonsPage = data => layout({ title, content, data })

export const GET = context => context.sendPage(buttonsPage)
