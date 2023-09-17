const User = use('App/Models/User')
const axios = require('axios')

const get_chats = async function () {
  return chats
}

const chats = []

const start = async (io, getUser) => {
  const chatInstance = io
    .of('/livechat')
    .use(async (socket, next) => {
      socket.user = await getUser(socket)
      next()
    })
    .on('connection', (socket) => {
      socket
        .on('chat:status', async () => {
          if (!socket.user) return
          socket.emit('chat:status', {
            chats: await get_chats(),
          })
        })
        .on('chat:send', async (data, callback) => {
          const user =
            socket.user && socket.user.length
              ? socket.user
              : await getUser(socket)
          if (!user)
            return callback({
              status: 'error',
              message: 'Login to chat',
            })

          if (data.text.length > 50 || data.text.length < 1)
            return callback({
              status: 'error',
              message: 'invalid text',
            })

          chats.push({
            user: user,
            text: data.text,
          })

          if (chats.length > 50) chats.shift()

          chatInstance.emit('chat:status', {
            chats: await get_chats(),
          })
        })
    })
}

module.exports.start = start
