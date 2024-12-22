import { Router } from 'express'

const rootRouter = Router()

const home = (req, res) => {
  res.render('index.html', {
    title: 'Home Page',
    user: req.user,
  })
}

rootRouter.get('/', home)

export { rootRouter }
