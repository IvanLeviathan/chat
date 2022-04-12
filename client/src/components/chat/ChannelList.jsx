import React from 'react'
import Channel from './Channel'

export default function ChannelList(props) {
  let list = `There is no channels to show`
  if (props.channels) {
    list = props.channels.map((c) => (
      <Channel
        key={c.id}
        id={c.id}
        name={c.name}
        participants={c.participants}
        onselectchannel={props.onselectchannel}
      />
    ))
  }
  return <div className="channel-list">{list}</div>
}
