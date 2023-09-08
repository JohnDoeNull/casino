'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CoinflipGame extends Model {
  static get hidden() {
    return ['rate_final']
  }

  bets() {
    return this.hasMany('App/Models/CoinflipBet', 'id', 'game_id')
  }
}

module.exports = CoinflipGame
