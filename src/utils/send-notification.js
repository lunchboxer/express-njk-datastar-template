import nunjucks from 'nunjucks'
import { join } from 'node:path'

const __dirname = import.meta.dirname
console.error(__dirname)

export const sendNotification = (res, message, type = 'info') => {
  nunjucks.configure(join(__dirname, '../views'), { autoescape: true })
  const notification = nunjucks.render('partials/notification.html', {
    id: Date.now(),
    message: nunjucks.renderString(message),
    type,
  })
  console.error(notification)
}
