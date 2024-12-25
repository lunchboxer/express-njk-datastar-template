import { setHeaders, loadPage } from '../utils/sse-utils.js'

export const loadHome = (req, res, _next) => {
  setHeaders(res)
  loadPage({ req, res })
  return res.end()
}
