'use strict'

const User = use('App/Models/User')
const Event = use('Event')
const Coinpayments = require('coinpayments')
const { validateAll } = use('Validator')

let CoinpaymentsCredentials = {
  key: '0aa83077edfbb51f8b58393aa67f511533316e0ac3e831e885f47e5fee8a5b22',
  secret: '624aCd165520CC2c8F1835617bC33192a83691eb281EE3F74dE4524C0cc00832',
}

const withdraw = async ({ addy, currency, amount }) => {
  const opt = {
    amount: amount,
    currency: currency,
    currency2: 'USD',
    address: addy,
    auto_confirm: 1,
    note: 'game_withdraw',
  }

  return await client.createWithdrawal(opt)
}

const client = new Coinpayments(CoinpaymentsCredentials)

class PaymentController {
  async withdraw({ request, auth, response }) {
    const user = await auth.getUser()
    const { addy, currency, amount } = request.only([
      'addy',
      'currency',
      'amount',
    ])
    try {
      if (amount > user.balance) {
        return response.json({
          status: 'error',
          message: 'Not enough fund!',
        })
      }
      const withdraw_res = await withdraw({ addy, currency, amount })
      user.balance -= amount
      await user.save()
      return response.json({
        status: 'success',
        message: 'Withdraw Success!',
      })
    } catch (err) {
      return response.json({
        status: 'error',
        message: err.extra.data.error,
      })
    }
  }
}

module.exports = PaymentController
