import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import ChannelList from './ChannelList'
import MeesagesPanel from './MeesagesPanel'
import socketClient from 'socket.io-client'
import './style.scss'
const SERVER = 'http://localhost:5000'

const socket = socketClient(SERVER, {
  transports: ['websocket'],
})

export default function Chat() {
  const [channels, setChannels] = useState(null)
  const [channel, setChannel] = useState(null)

  const loadChannels = async () => {
    fetch('/api/getChannels').then(async (response) => {
      let data = await response.json()
      setChannels(data.channels)
    })
  }

  const handleChannelSelect = (id) => {
    if (socket !== null) {
      let channel = channels.find((c) => {
        return c.id === id
      })
      setChannel(channel)
      socket.emit('channel-join', id, (ack) => {})
    }
  }

  const handleSendMessage = (channel_id, text) => {
    socket.emit('send-message', {
      channel_id,
      text,
      senderName: socket.id,
      id: Date.now(),
    })
  }

  useEffect(() => {
    console.log('loading channels')
    loadChannels()
  }, [])

  useEffect(() => {
    socket.on('connection', () => {
      console.log(`I'm connected with the back-end`)
    })
    socket.on('channel', (channel) => {
      let channelsState = channels.map((c) => {
        if (c.id === channel.id) c.participants = channel.participants
        return c
      })
      setChannels(channelsState)
    })
    socket.on('message', (message) => {
      let channelsState = channels.map((c) => {
        if (c.id === message.channel_id) {
          if (!c.messages) {
            c.messages = [message]
          } else {
            c.messages.push(message)
          }
        }
        return c
      })
      setChannels(channelsState)
    })
    return () => {
      socket.off('channel')
      socket.off('connection')
      socket.off('message')
    }
  }, [channels])

  return (
    <div className="chat-app">
      <ChannelList
        channels={channels}
        onselectchannel={handleChannelSelect}
      ></ChannelList>
      <MeesagesPanel onsendmessage={handleSendMessage} channel={channel} />
    </div>
  )
}
