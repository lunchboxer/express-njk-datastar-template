import { renderTemplate } from './utils.js'

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

export function loadPage({ req, res, templatePath, url, data }) {
  const { baseUrl, path } = req
  const newBaseUrl = baseUrl.replace('/magic', '')

  const newUrl = url ? url : newBaseUrl + path

  let newTemplatePath
  if (templatePath) {
    newTemplatePath = templatePath
  } else {
    newTemplatePath =
      url === '/'
        ? `pages${newBaseUrl}/index.html`
        : `pages${newBaseUrl}${path}.html`
  }
  const fragments = renderTemplate(newTemplatePath, data)
  mergeFragment({
    res,
    fragments,
    selector: 'main',
  })
  res.write('event: datastar-execute-script\n')
  res.write(`data: script window.history.replaceState({}, "", "${newUrl}")\n\n`)
}
