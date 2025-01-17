document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('student-password-input')
  const passwordDots = document.getElementById('password-dots')

  passwordInput.addEventListener('input', () => {
    passwordDots.innerHTML = ''

    // Create a dot for each character in the input
    for (const char in Array.from(passwordInput.value.trim())) {
      const div = document.createElement('div')
      div.classList.add(passwordInput.value[char]) // Add a class based on the character
      passwordDots.appendChild(div)
    }
  })
})
