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
export function magicRedirect(res, url) {
  res.write('event: datastar-execute-script\n')
  res.write('data: autoRemove true\n')
  res.write(`data: script window.history.pushState({}, "", "${url}")\n`)
  res.write(
    "data: script var popStateEvent = new PopStateEvent('popstate', {state: null});\n",
  )
  res.write('data: script window.dispatchEvent(popStateEvent);\n\n')
}

export function loadPage({ req, res, templatePath, url, data }) {
  const { baseUrl, path } = req
  const newUrl = url ? url : baseUrl + path

  let newTemplatePath
  if (templatePath) {
    newTemplatePath = templatePath
  } else {
    newTemplatePath = newUrl.endsWith('/')
      ? `pages${newUrl}index.html`
      : `pages${newUrl}.html`
  }
  const fragments = renderTemplate(newTemplatePath, data)
  mergeFragment({
    res,
    fragments,
    selector: 'main',
  })
}

export function reloadHeader(res, user) {
  const navMenu = renderTemplate('partials/nav-menu.html', {
    user,
  })
  mergeFragment({
    res,
    fragments: navMenu,
    selector: '#mainNav',
  })
}
