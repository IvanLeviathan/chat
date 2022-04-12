import React from 'react'

export default function Message(props) {
  return (
    <div className="message-item">
      <div>
        <b>{props.sendername}</b>
      </div>
      <span>{props.text}</span>
    </div>
  )
}
