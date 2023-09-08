'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CoinflipBetSchema extends Schema {
  up() {
    this.create('coinflip_bets', (table) => {
      table.increments()
      table.float('amount').defaultTo(0)
      table.float('rate_final').nullable()
      table.integer('coin_side').defaultTo(0)
      table.float('rate_auto').nullable()
      table.integer('user_id').unsigned().nullable()
      table.integer('game_id').unsigned()
      table.enum('status', ['await', 'lose', 'win']).defaultTo('await')
      table.timestamps()

      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('set null')
      table
        .foreign('game_id')
        .references('id')
        .inTable('crashes')
        .onDelete('cascade')

      table.unique(['user_id', 'game_id'])
    })
  }

  down() {
    this.drop('coinflip_bets')
  }
}

module.exports = CoinflipBetSchema
