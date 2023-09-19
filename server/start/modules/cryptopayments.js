const Coinpayments = require('coinpayments')
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const User = use('App/Models/User')
const Event = use('Event')

var app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let CoinpaymentsCredentials = {
  key: '0aa83077edfbb51f8b58393aa67f511533316e0ac3e831e885f47e5fee8a5b22',
  secret: '624aCd165520CC2c8F1835617bC33192a83691eb281EE3F74dE4524C0cc00832',
}

const client = new Coinpayments(CoinpaymentsCredentials)

module.exports = {
  create_addy: async (username) => {
    let LTCTaddress = (
      await client.getCallbackAddress({
        currency: 'LTCT',
        label: username,
      })
    ).address

    let LTCaddress = (
      await client.getCallbackAddress({
        currency: 'LTC',
        label: username,
      })
    ).address

    let ETHaddress = (
      await client.getCallbackAddress({
        currency: 'ETH',
        label: username,
      })
    ).address

    let BTCaddress = (
      await client.getCallbackAddress({
        currency: 'BTC',
        label: username,
      })
    ).address

    return { LTCTaddress, LTCaddress, ETHaddress, BTCaddress }
  },
  withdraw: async ({ amount, currency }) => {
    const opt = {
      amount: amount,
      currency: currency,
      currency2: 'USD',
      auto_confirm: 1,
      note: 'game_withdraw',
    }

    return await client.createWithdrawal(opt)
  },
}

const merchantId = '27cb016869e31ad8aa72a71a6d585430'
const secret = 'betbux'

app.use('/checkdepo', (req, res, next) => {
  const hmacHeader = req.headers['hmac']
  if (!hmacHeader) {
    return res.status(400).send('No HMAC signature sent')
  }

  const merchant = req.body.merchant || ''
  if (!merchant) {
    return res.status(400).send('No Merchant ID passed')
  }

  if (merchant !== merchantId) {
    return res.status(400).send('Invalid Merchant ID')
  }

  const request = new URLSearchParams(req.body).toString()

  if (!request) {
    return res.status(400).send('Error reading POST data')
  }

  const hmac = crypto.createHmac('sha512', secret).update(request).digest('hex')

  if (hmac !== hmacHeader) {
    return res.status(400).send('HMAC signature does not match')
  }

  next()
})

// client.createTransaction(...) Make a transaction
app.post('/checkdepo', async function (req, res) {
  res.send('ok')

  if (req.body.status_text == 'Deposit confirmed') {
    const user = await User.findBy(
      req.body.currency.toLowerCase() + 'address',
      req.body.address
    )
    const amount =
      parseFloat(req.body.fiat_amount) - parseFloat(req.body.fiat_fee)
    user.balance += amount

    await user.save()

    Event.fire('user::balance', { user, amount, type: 'positive' })
  }
})

app.listen(666)
