/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')

router.post('/login', [AuthController, 'login'])

// grupo de rotas protegidas
router
  .group(() => {
    router.resource('/user', AuthController).apiOnly()
  })
  .use(middleware.auth({ guards: ['api'] }))

// router.resource('/teste', AuthController).apiOnly()
