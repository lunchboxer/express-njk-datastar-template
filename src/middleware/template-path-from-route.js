import fs from 'node:fs'
import path from 'node:path'

const __dirname = import.meta.dirname

export const templatePathMiddleware = (req, res, next) => {
  if (req.path.startsWith('/static' || req.path.startsWith('/api'))) {
    return next()
  }
  const route = req.path
  const basePath = path.join(__dirname, '../views')

  const possiblePaths = [
    path.join(basePath, `${route}.html`),
    path.join(basePath, `${route}/index.html`),
  ]

  for (const templatePath of possiblePaths) {
    if (fs.existsSync(templatePath)) {
      req.templatePath = templatePath.replace(`${basePath}/`, '')
      res.locals.includeTemplate = req.templatePath
      break
    }
  }
  next()
}
