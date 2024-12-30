export const alertsMiddleware = (req, res, next) => {
  res.locals.alert = req.session.alert
  req.session.alert = null
  return next()
}
