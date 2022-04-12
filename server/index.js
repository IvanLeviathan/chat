import express from 'express'
import {} from 'dotenv/config'
import socketStart from './socket.js'
import http from 'http'

const app = express()
const PORT = process.env.PORT || 5000
export const STATIC_CHANNELS = [
  { id: 1, name: 'Общий', participants: 0, sockets: [], messages: [] },
  { id: 2, name: 'Смешнявки', participants: 0, sockets: [], messages: [] },
]

app.use(
  express.json({
    extended: true,
  }),
)

app.get('/api/getChannels', (req, res) => {
  res.json({
    channels: STATIC_CHANNELS,
  })
})

export const httpServer = http.createServer(app)

async function start() {
  try {
    httpServer.listen(PORT, () => {
      console.log(`Listening server on: ${PORT}`)
    })
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
  return
}

//start express
await start()
//start sockets
await socketStart()
