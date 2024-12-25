import { join } from 'node:path'
import nunjucks from 'nunjucks'
import { mergeFragment } from './sse-utils.js'

const __dirname = import.meta.dirname

export const sendNotification = (res, message, type = 'info', delay = 2000) => {
  nunjucks.configure(join(__dirname, '../views'), { autoescape: true })
  const notification = nunjucks.render('partials/notification.html', {
    id: Date.now(),
    message: nunjucks.renderString(message),
    type,
    delay,
  })

  mergeFragment({
    res,
    fragments: notification,
    selector: '#notification-list',
    mergeMode: 'append',
  })
}
