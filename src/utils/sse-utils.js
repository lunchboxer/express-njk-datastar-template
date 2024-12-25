export function setHeaders(res) {
  if (res.headersSent) {
    return
  }
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    connection: 'keep-alive',
  })
  res.flushHeaders()
}

export function mergeFragment({ res, fragments, selector, mergeMode, end }) {
  res.write('event: datastar-merge-fragments\n')
  if (selector) {
    res.write(`data: selector ${selector}\n`)
  }
  if (mergeMode) {
    res.write(`data: mergeMode ${mergeMode}\n`)
  }
  const fragmentLines = fragments.split('\n')
  for (const fragment of fragmentLines) {
    res.write(`data: fragments ${fragment}\n`)
  }
  res.write('\n')
  if (end) {
    res.end()
  }
}
