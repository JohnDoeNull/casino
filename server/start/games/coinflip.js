const User = use('App/Models/User')
const CoinflipGame = use('App/Models/CoinflipGame')
const CoinflipBet = use('App/Models/CoinflipBet')

const rnd = require('random-number')

const get_games = async function () {
  let game = await CoinflipGame.ids()

  game = await Promise.all(
    game.map(async (id) => {
      return {
        game: await CoinflipGame.findBy('id', id),
        bets: await CoinflipBet.query()
          .where('game_id', id)
          .with('user')
          .fetch(),
      }
    })
  )

  return game
}

const start = async (io, getUser) => {
  const coinflipInstance = io
    .of('/coinflip')
    .use(async (socket, next) => {
      socket.user = await getUser(socket)
      if (!socket.user) return
      next()
    })
    .on('connection', (socket) => {
      socket
        .on('game:status', async () => {
          //await CoinflipBet.truncate()
          socket.emit('game:status', {
            games: await get_games(),
          })
        })
        .on('game:make', async (data, callback) => {
          const user =
            socket.user && socket.user.length
              ? socket.user
              : await getUser(socket)
          let game = await user.coinflip().first()
          if (game) {
            return callback({
              status: 'error',
              message: 'You already have in a game',
            })
          }
          const start = Date.now()
          const rate = rnd({ min: 0, max: 1, integer: true })

          if (
            user.balance <= 0 ||
            user.balance < data.amount ||
            data.amount <= 0 ||
            !data.amount
          ) {
            return callback({
              status: 'error',
              message: 'Insufficient fund',
            })
          }

          if (data.coin_side != 0 && data.coin_side != 1) {
            return callback({
              status: 'error',
              message: 'Pick a coin side',
            })
          }

          game = await CoinflipGame.create({
            start_at: start,
            rate_final: rate,
            amount: 0,
          })

          try {
            await user.coinflip().create({
              amount: data.amount,
              coin_side: data.coin_side,
              game_id: game.id,
            })
            game.amount = data.amount
            user.balance -= data.amount
            await user.save()
            await game.save()

            coinflipInstance.emit('game:status', {
              games: await get_games(),
            })
          } catch (e) {
            return callback({
              status: 'error',
              message: 'Server Error!',
            })
          }
          callback({
            status: 'success',
            message: 'Your bid has been accepted!',
          })
        })
        .on('game:join', async (data, callback) => {
          const user =
            socket.user && socket.user.length
              ? socket.user
              : await getUser(socket)

          let game = await CoinflipGame.findBy('id', data.game.id)

          if (!game || game.status != 'await') {
            return callback({
              status: 'error',
              message: 'HAHA',
            })
          }

          if (user.balance <= 0 || user.balance < game.amount) {
            return callback({
              status: 'error',
              message: 'Insufficient fund',
            })
          }

          const first_bet = await CoinflipBet.findBy('game_id', game.id)

          if (first_bet.user_id == user.id) {
            return callback({
              status: 'error',
              message: 'Unable to join your game',
            })
          }

          const coin_side = first_bet.coin_side == 0 ? 1 : 0

          try {
            await user.coinflip().create({
              amount: game.amount,
              coin_side: coin_side,
              game_id: game.id,
            })
            game.status = 'rolling'
            user.balance -= game.amount
            await user.save()
            await game.save()

            coinflipInstance.emit('game:status', {
              games: await get_games(),
            })

            setTimeout(async () => {
              const win_bet = await CoinflipBet.query()
                .where('game_id', game.id)
                .where('coin_side', game.rate_final)
                .last()
              const lose_bet = await CoinflipBet.query()
                .where('game_id', game.id)
                .where('coin_side', game.rate_final == 0 ? 1 : 0)
                .last()
              const winner = await win_bet.user().first()
              const loser = await lose_bet.user().first()

              winner.balance += 2 * game.amount
              await winner.save()

              coinflipInstance.emit('game:done', {
                winner: winner.id,
                loser: loser.id,
                amount: game.amount * 2,
              })

              await CoinflipBet.query().where('game_id', game.id).delete()
              await game.delete()

              coinflipInstance.emit('game:status', {
                games: await get_games(),
              })
            }, 5000)
          } catch (e) {
            return callback({
              status: 'error',
              message: 'Server Error!',
            })
          }
          callback({
            status: 'success',
            message: 'Your bid has been accepted!',
          })
        })
    })
}

module.exports.start = start
