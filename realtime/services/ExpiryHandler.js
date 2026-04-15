const { createClient } = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = 6379;

module.exports = (io) => {
  const expiryClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });

  expiryClient.on('error', (err) => console.error('Redis Expiry Client Error', err));

  expiryClient.connect().then(() => {
    console.log('Redis Expiry Listener connected');
    
    // Subscribe to expired events
    // Ensure redis is configured with notify-keyspace-events Ex
    expiryClient.subscribe('__keyevent@0__:expired', async (key) => {
      if (key.startsWith('locks:')) {
        const seatId = key.split(':')[1];
        console.log(`Lock expired for seat: ${seatId}`);

        // Update map_state in Redis
        const mapKey = 'map_state';
        const pubClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
        await pubClient.connect();
        
        // Only update if it was still LOCKED (prevent overriding a SOLD state if possible, 
        // though SOLD should have deleted the lock key already)
        const currentStateStr = await pubClient.hGet(mapKey, seatId);
        if (currentStateStr) {
          const currentState = JSON.parse(currentStateStr);
          if (currentState.status === 'LOCKED') {
            const newState = JSON.stringify({ 
              status: 'AVAILABLE', 
              ts: Math.floor(Date.now() / 1000) 
            });
            await pubClient.hSet(mapKey, seatId, newState);

            // Broadcast to all clients
            io.emit('seat.updated', {
              id: seatId,
              status: 'AVAILABLE',
              ts: Math.floor(Date.now() / 1000)
            });
          }
        }
        await pubClient.disconnect();
      }
    });
  });
};
