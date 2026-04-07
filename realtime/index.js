const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = 6379;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const pubClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Redis adapter connected');
});

const rateLimiter = require('./middleware/rateLimiter');

// Middleware for JWT validation
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.user = decoded;
    next();
  });
});

// Middleware for Rate Limiting
io.use(rateLimiter);

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.sub);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.sub);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
});
