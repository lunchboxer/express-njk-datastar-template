export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack)

  res.status(err.status || 500)

  if (req.accepts('html')) {
    res.render('error.html', {
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

export const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
