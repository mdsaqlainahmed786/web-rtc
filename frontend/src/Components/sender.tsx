import React from 'react'
import { useEffect } from 'react'

function Sender() {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws')
        socket.onopen = () =>{
            console.log('WebSocket connection established')
            socket.send(JSON.stringify({ type: 'sender' }))
        }
    },[])
  return (
    <div>Sender</div>
  )
}

export default Sender