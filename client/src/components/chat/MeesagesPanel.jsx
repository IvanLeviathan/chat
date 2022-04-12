import React, { useState } from 'react'
import Message from './Message'

export default function MeesagesPanel(props) {
  const [text, setText] = useState('')

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleSend = () => {
    props.onsendmessage(props.channel.id, text)
    setText('')
  }

  let list = (
    <div className="no-content-message">There is no messages to show</div>
  )
  if (props.channel && props.channel.messages) {
    list = props.channel.messages.map((m) => {
      return (
        <Message key={m.id} id={m.id} sendername={m.senderName} text={m.text} />
      )
    })
  }
  return (
    <div className="messages-panel">
      <div className="meesages-list">{list}</div>
      <div className="messages-input">
        <input type="text" value={text} onChange={handleTextChange} />‍
        <button onClick={handleSend}>Send</button>‍
      </div>
    </div>
  )
}
