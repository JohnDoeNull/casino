'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CoinflipBet extends Model {
  static get visible() {
    return ['id', 'amount', 'coin_side', 'status', 'user']
  }

  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id')
  }

  game() {
    return this.hasOne('App/Models/CoinflipGame', 'id', 'game_id')
  }
}

module.exports = CoinflipBet
