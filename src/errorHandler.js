export const errorHandler500 = (err, req, res, _next) => {
  console.error(err.stack)

  res.status(err.status || 500)

  if (req.accepts('html')) {
    res.render('error.html', {
      user: req.user,
      message: err.message,
      error: err,
      status: err.statusCode || 500,
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
  res.status(404)
  if (req.accepts('html')) {
    res.render('404.html', { user: req.user, url: req.url })
    return
  }

  if (req.accepts('json')) {
    res.json({ error: 'Not found' })
    return
  }
  res.type('txt').send('Not found')
}
