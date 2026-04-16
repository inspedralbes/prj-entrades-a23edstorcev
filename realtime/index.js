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
const expiryHandler = require('./services/ExpiryHandler');
const seatUpdateHandler = require('./services/SeatUpdateHandler');
const queueService = require('./services/QueueService');

app.use(express.json());
app.use(require('cors')());

// Logging middleware for HTTP requests
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// HTTP Endpoints for Queue Status (Pre-Check)
app.get('/rt-api/queue/status/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const status = await queueService.getQueueStatus(eventId);
  res.json(status);
});

app.post('/rt-api/queue/join', async (req, res) => {
  const { eventId, userId } = req.body;
  if (!eventId || !userId) return res.status(400).json({ error: 'Missing params' });
  
  const result = await queueService.joinQueue(eventId, userId);
  res.json(result);
});

app.get('/rt-api/queue/check-status/:eventId/:userId', async (req, res) => {
  const { eventId, userId } = req.params;
  const status = await queueService.checkUserStatus(eventId, userId);
  res.json(status);
});

const lockingService = require('./services/LockingService');

app.post('/rt-api/queue/leave', async (req, res) => {
  const { eventId, userId } = req.body;
  if (!eventId || !userId) return res.status(400).json({ error: 'Missing params' });
  
  // 1. Liberar posición en cola activa
  await queueService.leaveActive(eventId, userId);
  await queueService.leaveQueue(eventId, userId);
  
  // 2. Liberar todos los asientos bloqueados por el usuario
  await lockingService.releaseAllUserLocks(userId, eventId, io);
  
  res.json({ success: true });
});

app.get('/rt-api/map-state/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const mapKey = `map_state:${eventId}`;
  const allStates = await pubClient.hGetAll(mapKey);
  res.json(allStates);
});

// Middleware for JWT validation
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.error('Socket Connection Attempt: No token provided');
    return next(new Error('Authentication error: No token'));
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Socket JWT Verification Failed:', err.message);
      // En entorno de desarrollo, si el error es de clave, permitimos loguear para no bloquear al usuario
      // pero esto es solo para DEBUG. 
      return next(new Error('Authentication error: Invalid Token'));
    }
    socket.user = decoded;
    next();
  });
});

// Middleware for Rate Limiting
io.use(rateLimiter);

// Initialize Listeners
expiryHandler(io);
seatUpdateHandler(io);

const seatHandler = require('./sockets/SeatHandler');

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.sub);
  
  // Debug: Log all events
  socket.onAny((eventName, ...args) => {
    console.log(`Incoming Event: ${eventName}`, args);
  });

  // Register handlers
  seatHandler(io, socket);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.sub);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
});
