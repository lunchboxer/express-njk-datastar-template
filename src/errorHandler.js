export const errorHandler500 = (err, req, res, _next) => {
  res.status(err.status || 500)

  const data = {
    user: req.user,
    error: err,
    status: err.status || 500,
  }
  if (req.accepts('html')) {
    res.render('error', {
      title: 'Error',
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
  if (req.accepts('html')) {
    return res.render('404', {
      title: 'Page Not Found',
      ...data,
    })
  }

  if (req.accepts('json')) {
    res.json({ error: 'Not found' })
    return
  }
  res.type('txt').send('Not found')
}
