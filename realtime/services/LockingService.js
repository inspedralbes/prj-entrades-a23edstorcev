const { createClient } = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const redisClient = createClient({ url: `redis://${REDIS_HOST}:6379` });
redisClient.connect();

const LOCK_TTL = 600; // 10 minutes in seconds

const lockSeatScript = `
  local lockKey = KEYS[1]
  local mapKey = KEYS[2]
  local seatId = ARGV[1]
  local userId = ARGV[2]
  local ttl = ARGV[3]
  local ts = ARGV[4]

  -- Check current lock owner
  local currentOwner = redis.call("GET", lockKey)
  
  if currentOwner == userId then
    -- It's MINE, unlock it (toggle off)
    redis.call("DEL", lockKey)
    local newState = cjson.encode({status = "AVAILABLE", ts = ts})
    redis.call("HSET", mapKey, seatId, newState)
    return "UNLOCKED"
  elseif not currentOwner then
    -- It's FREE, check if sold
    local currentState = redis.call("HGET", mapKey, seatId)
    if currentState then
      local state = cjson.decode(currentState)
      if state.status == "SOLD" then
        return {err = "ALREADY_SOLD"}
      end
    end
    -- Lock it (toggle on)
    redis.call("SET", lockKey, userId, "NX", "EX", ttl)
    local newState = cjson.encode({status = "LOCKED", u = userId, ts = ts})
    redis.call("HSET", mapKey, seatId, newState)
    return "LOCKED"
  else
    -- It's someone else's
    return {err = "ALREADY_LOCKED"}
  end
`;

class LockingService {
  async lockSeat(seatId, userId, eventId) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const lockKey = `locks:${eventId}:${seatId}`;
      const mapKey = `map_state:${eventId}`;

      const result = await redisClient.eval(lockSeatScript, {
        keys: [lockKey, mapKey],
        arguments: [seatId, userId, LOCK_TTL.toString(), timestamp]
      });

      if (result === 'LOCKED' || result === 'UNLOCKED') {
        return { success: true, action: result };
      } else if (result.err) {
        return { success: false, error: result.err };
      }
    } catch (err) {
      console.error('Locking error:', err);
      return { success: false, error: 'SERVER_ERROR' };
    }
  }

  async getUserLocks(userId, eventId) {
    try {
      const mapKey = `map_state:${eventId}`;
      const allStates = await redisClient.hGetAll(mapKey);
      const userLocks = [];

      for (const [seatId, stateJson] of Object.entries(allStates)) {
        const state = JSON.parse(stateJson);
        if (state.status === 'LOCKED' && String(state.u) === String(userId)) {
          const ttl = await redisClient.ttl(`locks:${eventId}:${seatId}`);
          if (ttl > 0) {
            userLocks.push({ seatId, ttl });
          }
        }
      }
      return userLocks;
    } catch (err) {
      console.error('Error getting user locks:', err);
      return [];
    }
  }

  async releaseLock(seatId, userId, eventId) {
    const lockKey = `locks:${eventId}:${seatId}`;
    const mapKey = `map_state:${eventId}`;

    const currentLock = await redisClient.get(lockKey);
    if (currentLock === userId) {
      await redisClient.del(lockKey);
      // Update map_state to AVAILABLE
      const newState = JSON.stringify({ status: 'AVAILABLE', ts: Math.floor(Date.now() / 1000) });
      await redisClient.hSet(mapKey, seatId, newState);
      return true;
    }
    return false;
  }

  async releaseAllUserLocks(userId, eventId, io) {
    try {
      const mapKey = `map_state:${eventId}`;
      const allStates = await redisClient.hGetAll(mapKey);
      const timestamp = Math.floor(Date.now() / 1000).toString();

      for (const [seatId, stateJson] of Object.entries(allStates)) {
        const state = JSON.parse(stateJson);
        if (state.status === 'LOCKED' && String(state.u) === String(userId)) {
          const lockKey = `locks:${eventId}:${seatId}`;
          await redisClient.del(lockKey);
          
          const newState = JSON.stringify({ status: 'AVAILABLE', ts: timestamp });
          await redisClient.hSet(mapKey, seatId, newState);

          // Notificar a todos por socket
          if (io) {
            io.emit('seat.updated', {
              id: seatId,
              event_id: eventId,
              status: 'AVAILABLE',
              u: null,
              ts: timestamp
            });
          }
        }
      }
    } catch (err) {
      console.error('Error releasing all user locks:', err);
    }
  }
}

module.exports = new LockingService();
