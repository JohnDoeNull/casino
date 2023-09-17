'use strict'

const Mail = use('Mail')
const Event = use('Event')
const User = use('App/Models/User')

const cryptopayments = require('./modules/cryptopayments')

Event.on('user::register', async (user) => {
  const { LTCTaddress, ETHaddress, LTCaddress, BTCaddress } =
    await cryptopayments.create_addy(user.username)

  user.ltctaddress = LTCTaddress
  user.ethaddress = ETHaddress
  user.ltcaddress = LTCaddress
  user.btcaddress = BTCaddress

  await user.save()

  await Mail.send('emails.registration', user.toJSON(), (message) => {
    message
      .to(user.email)
      .from(process.env.MAIL_FROM)
      .subject('Регистрация на сайте')
  })
})

Event.on('user::confirmation', async (user, confirmation) => {
  await Mail.send(
    'emails.confirmation',
    { user: user.toJSON(), confirmation, baseUrl: process.env.CLIENT_URL },
    (message) => {
      message
        .to(confirmation.email)
        .from(process.env.MAIL_FROM)
        .subject('Подтверждение почты')
    }
  )
})
