import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import { socketServer } from './socket-server/index.mjs';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, turbo: true });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173', // or "*" for testing
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  global.io = io;
  socketServer(io);

  httpServer
    .once('error', err => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
