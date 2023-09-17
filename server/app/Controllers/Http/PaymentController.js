'use strict'

const User = use('App/Models/User')
const Event = use('Event')

const { validateAll } = use('Validator')

class PaymentController {
  async user({ auth, response }) {
    const user = await auth.getUser()

    return response.json({
      status: 'success',
      data: {
        user: await User.query()
          .where('id', user.id)
          .with('socials')
          .setVisible([
            'id',
            'first_name',
            'last_name',
            'fullname',
            'username',
            'email',
            'avatar',
            'balance',
            'balance_demo',
          ])
          .first(),
      },
    })
  }
}

module.exports = PaymentController
