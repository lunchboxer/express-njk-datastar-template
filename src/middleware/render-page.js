import { loadPage, reloadHeader, setHeaders } from '../utils/sse-utils.js'

export const renderMiddleware = (req, res, next) => {
  res.renderPage = (
    templatePath = req?.templatePath,
    data = {},
    options = {},
  ) => {
    if (req.body?.sse || req.query?.datastar) {
      setHeaders(res)
      loadPage({ req, res, templatePath, data })
      if (options.reloadHeader) {
        reloadHeader(res, data.user)
      }
      return
    }
    if (req.accepts('html')) {
      return res.render('base', { includeTemplate: templatePath, ...data })
    }
    return res.json(data)
  }
  next()
}
