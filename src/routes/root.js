import { Router } from 'express'

const rootRouter = Router()

rootRouter.get('/', (_req, res) => res.renderPage())

export { rootRouter }
