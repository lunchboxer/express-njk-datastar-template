export const referrerMiddleware = (req, res, next) => {
  // put the current URL in the response object so that the view can use it
  res.locals.referrer = req.originalUrl
  next()
}
