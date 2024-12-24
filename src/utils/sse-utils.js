export function setHeaders(res) {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  })
  res.flushHeaders()
}

export function sendSSE({ res, frag, selector, merge, mergeType, end }) {
  res.write('event: datastar-merge-fragments\n')
  if (selector) {
    res.write('data: selector {selector.value}\n')
  }
  if (merge) {
    res.write('data: mergeMode {mergeType.value}\n')
  }
  res.write('data: fragments {frag.value}\n\n')
  if (end) {
    res.end()
  }
}
