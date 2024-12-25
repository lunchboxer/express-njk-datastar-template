import nunjucks from 'nunjucks'
import { mergeFragment } from './sse-utils.js'
import { renderTemplate } from './utils.js'

export const sendNotification = (res, message, type = 'info', delay = 2000) => {
  const notification = renderTemplate('partials/notification.html', {
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
