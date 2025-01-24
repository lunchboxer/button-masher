import { combineStreams, setSseHeaders } from '../utils/sse-helpers.js'

export function sendSseMiddleware(context) {
  context.sendSse = streamOrStreams => {
    setSseHeaders(context)
    const stream = Array.isArray(streamOrStreams)
      ? combineStreams(streamOrStreams)
      : streamOrStreams

    return new Response(stream, { headers: context.headers })
  }
}
