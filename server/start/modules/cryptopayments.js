const Coinpayments = require('coinpayments')

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
}
