import { loadPage } from './utils/sse-utils.js'

export const errorHandler500 = (err, req, res, _next) => {
  const templatePath = 'error.html'
  res.status(err.status || 500)

  const data = {
    user: req.user,
    error: err,
    status: err.statusCode || 500,
  }
  if (req.query?.datastar) {
    return loadPage({ req, res, templatePath, data })
  }
  if (req.accepts('html')) {
    res.render('base', {
      title: 'Server Error',
      includeTemplate: templatePath,
      ...data,
    })
  } else if (req.accepts('application/json')) {
    res.json({
      error: {
        message: err.message,
      },
    })
  } else {
    res.type('text').send(`Error: ${err.message}`)
  }
}

export const errorHandler404 = (req, res, _next) => {
  const data = { user: req.user, path: req.path }
  res.status(404)
  const templatePath = '404.html'
  if (req.query?.datastar) {
    return loadPage({ req, res, templatePath, data })
  }
  if (req.accepts('html')) {
    return res.render('base', {
      title: 'Not Found',
      includeTemplate: templatePath,
      ...data,
    })
  }

  if (req.accepts('json')) {
    res.json({ error: 'Not found' })
    return
  }
  res.type('txt').send('Not found')
}
