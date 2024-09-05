// lib/websocketService.ts
import { io, Socket } from 'socket.io-client';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private fallbackInterval: NodeJS.Timeout | null = null;

  private constructor(private url: string) {}

  static getInstance(url: string): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url);
    }
    return WebSocketService.instance;
  }

  connect(): void {
    if (this.socket?.connected) return;

    console.log('Attempting to connect to WebSocket server...');
    this.socket = io(this.url, {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected successfully');
      if (this.fallbackInterval) {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
      }
    });

    this.socket.on('price-update', this.handlePriceUpdate);

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected. Reason:', reason);
      this.startFallbackPolling();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      this.startFallbackPolling();
    });
  }

  private handlePriceUpdate = (data: any) => {
    console.log('Received price update:', data);
    this.messageHandlers.forEach(handler => handler(data));
  };

  private startFallbackPolling(): void {
    if (this.fallbackInterval) return;

    console.log('Starting fallback polling mechanism');
    this.fallbackInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/price');
        const data = await response.json();
        this.handlePriceUpdate(data);
      } catch (error) {
        console.error('Error in fallback polling:', error);
      }
    }, 5000);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }
}

export default WebSocketService;