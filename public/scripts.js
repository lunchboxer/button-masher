document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  const theme = savedTheme || systemTheme
  document.querySelector(`.theme-switcher input[value="${theme}"]`).checked =
    true
  localStorage.setItem('theme', theme)

  document
    .getElementById('theme-switcher-light')
    .addEventListener('click', () => {
      localStorage.setItem('theme', 'light')
    })
  document
    .getElementById('theme-switcher-dark')
    .addEventListener('click', () => {
      localStorage.setItem('theme', 'dark')
    })

  document.addEventListener('click', event => {
    const openModalButton = event.target.closest('[data-open-modal]')
    if (openModalButton) {
      event.preventDefault()
      const modalId = openModalButton.getAttribute('data-open-modal')
      const modal = document.getElementById(modalId)
      if (modal) {
        modal.showModal()
      }
    }
  })
})
