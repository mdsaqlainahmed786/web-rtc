import React, { useEffect } from 'react'

function Receiver() {
      useEffect(() => {
          const socket = new WebSocket('ws://localhost:8080/ws')
          socket.onopen = () =>{
              console.log('WebSocket connection established')
              socket.send(JSON.stringify({ type: 'receiver' }))
          }
      },[])
  return (
    <div>Receiver</div>
  )
}

export default Receiver