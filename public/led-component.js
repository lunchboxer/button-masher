class LedComponent extends HTMLElement {
  constructor() {
    super()
    // Attach a shadow DOM tree to the element
    this.attachShadow({ mode: 'open' })

    // Define the template for the LEDs
    this.shadowRoot.innerHTML = `
      <style>
        .led-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .led {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          opacity: 0.3;
          transition: opacity 0.2s;
        }

        .led.green {
          background-color: var(--green, lime);
        }

        .led.red {
          background-color: var(--red, red);
        }

        .led.on {
          opacity: 1;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      </style>
      <div class="led-container">
        <div class="led green"></div>
        <div class="led red"></div>
      </div>
    `

    // Cache references to the LEDs
    this.greenLed = this.shadowRoot.querySelector('.led.green')
    this.redLed = this.shadowRoot.querySelector('.led.red')
  }

  // Observe the "message" attribute for changes
  static get observedAttributes() {
    return ['message']
  }

  // Called when the "message" attribute changes
  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'message') {
      this.handleMessage(newValue)
    }
  }

  // Handle the message and trigger the appropriate LED animation
  handleMessage(message) {
    switch (message) {
      case 'idle':
        this.startIdleAnimation()
        break
      case 'loading':
        this.startLoadingAnimation()
        break
      case 'success':
        this.triggerSuccess()
        break
      case 'error':
        this.triggerError()
        break
      default:
        // Default to idle state
        this.startIdleAnimation()
    }
  }

  // Start idle animation (2 quick flashes every 3 seconds)
  startIdleAnimation() {
    this.stopAllAnimations()
    this.idleInterval = setInterval(() => {
      this.flashBothLeds(2, 200)
    }, 3000)
  }

  // Start loading animation (slow pulsing of green LED)
  startLoadingAnimation() {
    this.stopAllAnimations()
    this.greenLed.style.animation = 'pulse 1.5s infinite'
  }

  // Trigger success (5 quick green flashes)
  triggerSuccess() {
    this.stopAllAnimations()
    this.flashLed(this.greenLed, 5, 200, () => {
      this.startIdleAnimation()
    })
  }

  // Trigger error (5 quick red flashes)
  triggerError() {
    this.stopAllAnimations()
    this.flashLed(this.redLed, 5, 100, () => {
      this.startIdleAnimation()
    })
  }

  // Flash an LED a specified number of times
  flashLed(led, count, interval, callback) {
    let flashCount = 0
    const flashInterval = setInterval(() => {
      led.classList.toggle('on')
      flashCount++
      if (flashCount === count * 2) {
        clearInterval(flashInterval)
        led.classList.remove('on') // Ensure the LED is off after flashing
        if (callback) {
          callback()
        }
      }
    }, interval)
  }

  // Flash both LEDs together
  flashBothLeds(count, interval) {
    this.flashLed(this.greenLed, count, interval)
    this.flashLed(this.redLed, count, interval)
  }

  // Stop all animations and intervals
  stopAllAnimations() {
    if (this.idleInterval) {
      clearInterval(this.idleInterval)
      this.idleInterval = null
    }
    this.greenLed.style.animation = ''
    this.redLed.style.animation = ''
    this.greenLed.classList.remove('on')
    this.redLed.classList.remove('on')
  }
}

// Define the custom element
customElements.define('led-component', LedComponent)
