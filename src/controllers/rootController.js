import { loadPage } from '../utils/sse-utils.js'

export const loadHome = (req, res, _next) => {
  if (req.query?.datastar) {
    return loadPage({ req, res })
  }
  res.render('index.html', {
    title: 'Home Page',
    user: req.user,
  })
}
