import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  show({ params, response }: HttpContext) {
    try {
      // Obtenha os valores do formulário
      const id = params.id

      // Crie e salve o usuário no banco de dados
      const user = User.findOrFail(id)

      return user // Retorna o usuário criado com status 201
    } catch (error) {
      console.error(error) // Exibe o erro no console para diagnóstico
      return response.badRequest('Usuário não encontrado') // Retorna 400 em caso de erro
    }
  }

  index({ response }: HttpContext) {
    try {
      // Crie e salve o usuário no banco de dados
      const user = User.query()

      return user // Retorna o usuário criado com status 201
    } catch (error) {
      console.error(error) // Exibe o erro no console para diagnóstico
      return response.badRequest('Usuário não encontrado') // Retorna 400 em caso de erro
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      // Obtenha os valores do formulário
      const { email, password } = request.only(['email', 'password'])

      // Crie e salve o usuário no banco de dados
      const user = await User.create({
        email,
        password,
      })

      return response.created(user) // Retorna o usuário criado com status 201
    } catch (error) {
      console.error(error) // Exibe o erro no console para diagnóstico
      return response.badRequest('Erro ao registrar usuário') // Retorna 400 em caso de erro
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      // Obtenha os valores do formulário
      const id = params.id

      // Crie e salve o usuário no banco de dados
      const user = await User.findOrFail(id)

      user.delete()

      return user
    } catch (error) {
      console.error(error) // Exibe o erro no console para diagnóstico
      return response.badRequest('Usuário não encontrado') // Retorna 400 em caso de erro
    }
  }

  async update({ request, params, response }: HttpContext) {
    try {
      const data = request.only(['id', 'password'])

      const id = params.id

      const user = await User.findOrFail(id)

      user.merge(data)

      await user.save()

      return response.ok(user)
    } catch (error) {
      console.error(error)
      return response.notFound('Usuário não encontrado')
    }
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }
}
