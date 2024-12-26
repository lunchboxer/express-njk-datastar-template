import { Router } from 'express'
import { loadHome } from '../controllers/rootController.js'

const rootRouter = Router()

rootRouter.get('/', loadHome)

export { rootRouter }
