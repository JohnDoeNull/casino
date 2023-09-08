'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CoinflipGameSchema extends Schema {
  up() {
    this.create('coinflip_games', (table) => {
      table.increments()
      table.string('start_at').notNullable()
      table.float('rate_final').defaultTo(1)
      table.float('amount').defaultTo(0)
      table.string('status').defaultTo('await')
      table.float('rate_current').defaultTo(1)
      table.timestamps()
    })
  }

  // down() {
  //   this.drop('coinflip_games')
  // }
}

module.exports = CoinflipGameSchema
