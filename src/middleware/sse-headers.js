export const setHeadersMiddleware = (req, res, next) => {
  const { datastar } = req.query
  if (!datastar) {
    return next()
  }
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    connection: 'keep-alive',
  })
  res.flushHeaders()
  next()
}
