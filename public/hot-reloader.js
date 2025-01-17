function connectSse() {
  console.info('🏃 Connecting to hot-reload server...')
  const eventSource = new EventSource('/reload')

  eventSource.onmessage = message => {
    if (message.data === 'reload') {
      location.reload()
    }
  }

  eventSource.onopen = () => {
    console.info('🔥 Hot reloader is listening for changes...')
  }

  eventSource.onerror = () => {
    console.info('SSE connection error. Reconnecting...')
    eventSource.close()
    setTimeout(connectSse, 1000) // Reconnect after 1 second
  }
}

connectSse()
