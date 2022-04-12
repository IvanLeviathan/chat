import { Server } from 'socket.io'
import { httpServer, STATIC_CHANNELS } from './index.js'

const socketStart = async () => {
  if (!httpServer) return console.log('Error starting socket')
  const io = new Server(httpServer)
  console.log('Socket started')
  io.on('connection', (socket) => {
    console.log('new client connected')
    socket.emit('connection', null)
    socket.on('channel-join', (id) => {
      console.log('channel join', id)

      STATIC_CHANNELS.forEach((c) => {
        if (c.id === id) {
          if (c.sockets.indexOf(socket.id) == -1) {
            c.sockets.push(socket.id)
            c.participants++
            io.emit('channel', c)
          }
        } else {
          let index = c.sockets?.indexOf(socket.id)
          if (index != -1) {
            c.sockets.splice(index, 1)
            c.participants--
            io.emit('channel', c)
          }
        }
      })
      return id
    })
    socket.on('send-message', (message) => {
      STATIC_CHANNELS.forEach((c) => {
        if (c.id === message.channel_id) c.messages.push(message)
      })
      io.emit('message', message)
    })
  })
}
export default socketStart
