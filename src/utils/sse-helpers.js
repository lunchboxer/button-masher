export function setSseHeaders(context) {
  context.headers = new Headers(context.headers)
  context.headers.set('Content-Type', 'text/event-stream')
  context.headers.set('Cache-Control', 'no-cache')
  context.headers.set('Connection', 'keep-alive')
}

export const mergeSignals = ({
  signals = {},
  onlyIfMissing = false,
  end = true,
}) =>
  new ReadableStream({
    start(controller) {
      controller.enqueue('event: datastar-merge-signals\n')
      controller.enqueue(`data: onlyIfMissing ${onlyIfMissing}\n`)
      for (const [key, value] of Object.entries(signals)) {
        controller.enqueue(
          `data: signals ${JSON.stringify({ [key]: value })}\n`,
        )
      }
      controller.enqueue('\n')
      if (end) {
        controller.close()
      }
    },
  })

export const mergeFragments = ({
  selector,
  fragments,
  mergeMode,
  end = true,
}) =>
  new ReadableStream({
    start(controller) {
      controller.enqueue('event: datastar-merge-fragments\n')
      if (selector) {
        controller.enqueue(`data: selector ${selector}\n`)
      }
      if (mergeMode) {
        controller.enqueue(`data: mergeMode ${mergeMode}\n`)
      }
      const fragmentLines = fragments.split('\n')
      for (const line of fragmentLines) {
        controller.enqueue(`data: fragments ${line}\n`)
      }
      controller.enqueue('\n')
      if (end) {
        controller.close()
      }
    },
  })

export const removeFragments = selector =>
  new ReadableStream({
    start(controller) {
      controller.enqueue('event: datastar-remove-fragments\n')
      controller.enqueue(`data: selector ${selector}\n`)
      controller.enqueue('\n')
      controller.close()
    },
  })

export const removeSignals = (signalOrSignals, end = true) => {
  const signals = Array.isArray(signalOrSignals)
    ? signalOrSignals
    : [signalOrSignals]
  return new ReadableStream({
    start(controller) {
      controller.enqueue('event: datastar-remove-signals\n')
      for (const signal of signals) {
        controller.enqueue(`data: paths ${signal}\n`)
      }
      if (end) {
        controller.close()
      }
    },
  })
}

export const combineStreams = streams => {
  return new ReadableStream({
    start(controller) {
      for (const stream of streams) {
        const reader = stream.getReader()
        for (const line of reader.readMany().value) {
          controller.enqueue(line)
        }
      }
      // controller.close()
    },
  })
}
