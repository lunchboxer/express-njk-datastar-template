import { Router } from 'express'
import { authRouter } from './auth.js'
import { rootRouter } from './root.js'
import { userRouter } from './user.js'

const magicRouter = Router()

magicRouter
  .use('/', rootRouter)
  .use('/auth', authRouter)
  .use('/users', userRouter)

  .use((err, _req, res, _next) => {
    console.error(err)
    const status = err.status || 500
    res.status(status).json({ error: err.message })
  })

  .use((_req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })
export { magicRouter }
