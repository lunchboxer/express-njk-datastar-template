import { join } from 'node:path'
import nunjucks from 'nunjucks'

const __dirname = import.meta.dirname

export const renderTemplate = (templatePath, data) => {
  nunjucks.configure(join(__dirname, '../views'), { autoescape: true })
  return nunjucks.render(templatePath, data)
}
