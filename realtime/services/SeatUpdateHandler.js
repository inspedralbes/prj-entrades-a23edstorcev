const { createClient } = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = 6379;

module.exports = (io) => {
  const subClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });

  subClient.on('error', (err) => console.error('Redis SeatUpdate Listener Error', err));

  subClient.connect().then(() => {
    console.log('Redis SeatUpdate Listener connected');
    
    subClient.subscribe('seat_updates', async (message) => {
      try {
        const { type, payload } = JSON.parse(message);
        console.log(`Received external update: ${type}`, payload);

        if (type === 'seat.sold' || type === 'seat.released') {
          // Update map_state in Redis to ensure it's up to date for new clients
          const eventId = payload.event_id;
          if (!eventId) {
            console.error('Received update without eventId:', payload);
            return;
          }
          
          const mapKey = `map_state:${eventId}`;
          const pubClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
          
          try {
            await pubClient.connect();
            
            await pubClient.hSet(mapKey, payload.id, JSON.stringify({
              status: payload.status,
              u: payload.u,
              ts: payload.ts
            }));
            
            // NETEJA: Borrar la clau de lock per evitar que segueixi sortint com a seleccionat
            const lockKey = `locks:${eventId}:${payload.id}`;
            await pubClient.del(lockKey);
            
            console.log(`Successfully updated Redis for seat ${payload.id} as ${payload.status}`);
          } catch (redisErr) {
            console.error('Failed to update Redis in SeatUpdateHandler:', redisErr);
          } finally {
            await pubClient.disconnect();
          }

          // Broadcast to all Socket.IO clients
          io.emit('seat.updated', payload);
        }
      } catch (err) {
        console.error('Error processing seat_update:', err);
      }
    });
  });
};
