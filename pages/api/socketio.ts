// pages/api/socketio.ts
import { Server as ServerIO } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseWithSocket } from '../../types/next';

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new ServerIO(res.socket.server as any, {
    path: '/api/socketio',
    addTrailingSlash: false,
    transports: ['websocket'],
    cors: {
      origin: '*',
    },
  });
  res.socket.server.io = io;

  io.on('connection', socket => {
    console.log('New client connected', socket.id);

    // Simulate real-time data updates
    const interval = setInterval(() => {
      const newPrice = {
        date: new Date().toISOString().split('T')[0],
        price: Math.random() * 10 + 20 // Random price between 20 and 30
      };
      console.log('Emitting price update:', newPrice);
      socket.emit('price-update', newPrice);
    }, 5000); // Send update every 5 seconds

    socket.on('disconnect', (reason) => {
      console.log('Client disconnected', socket.id, 'Reason:', reason);
      clearInterval(interval);
    });
  });

  console.log('Socket server initialized');
  res.end();
};

export default SocketHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};