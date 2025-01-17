let buttonPressBuffer = ''

function handleButtonPress(color) {
  buttonPressBuffer += color[0]

  if (buttonPressBuffer.length >= 3 && buttonPressBuffer.slice(-3) === 'ppp') {
    const sequenceLength = buttonPressBuffer.length - 3
    if (sequenceLength >= 4 && sequenceLength <= 8) {
      const payload = buttonPressBuffer.slice(0, -3)
      sendLoginRequest(payload)
    } else {
      triggerError()
    }
    buttonPressBuffer = ''
    return
  }

  if (buttonPressBuffer.length >= 3 && buttonPressBuffer.slice(-3) === 'www') {
    buttonPressBuffer = ''
    triggerError()
    return
  }

  if (buttonPressBuffer.length > 11) {
    buttonPressBuffer = ''
  }
}

function sendLoginRequest(payload) {
  const ledComponent = document.querySelector('led-component')
  if (ledComponent) {
    ledComponent.setAttribute('message', 'loading')
  }

  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: payload, password: payload }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        triggerSuccess()
      } else {
        triggerError()
      }
    })
    .catch(error => {
      console.error('Error:', error)
      triggerError()
    })
}

function triggerError() {
  const ledComponent = document.querySelector('led-component')
  if (ledComponent) {
    ledComponent.setAttribute('message', 'error')
  }
}

function triggerSuccess() {
  const ledComponent = document.querySelector('led-component')
  if (ledComponent) {
    ledComponent.setAttribute('message', 'success')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.button.special')
  for (const button of buttons) {
    button.addEventListener('click', () =>
      handleButtonPress(button.classList[2]),
    )
  }
})
