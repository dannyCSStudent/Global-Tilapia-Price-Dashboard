// lib/websocketService.ts
import { io, Socket } from 'socket.io-client'

class WebSocketService {

  private socket: Socket | null = null

  constructor(private url: string) {}

  connect(onMessage: (data: any) => void): void {
    console.log("websocket hit :", this.socket )
    this.socket = io(this.url)
    console.log("websocket hit 2:", this.socket )

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    this.socket.on('price-update', (data) => {
      onMessage(data)
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}

export default WebSocketService