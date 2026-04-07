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

  -- Check if seat is already sold in map_state
  local currentState = redis.call("HGET", mapKey, seatId)
  if currentState then
    local state = cjson.decode(currentState)
    if state.status == "SOLD" then
      return {err = "ALREADY_SOLD"}
    end
  end

  -- Attempt to lock the seat using SET NX EX
  local locked = redis.call("SET", lockKey, userId, "NX", "EX", ttl)
  
  if locked then
    -- Update map_state hash for O(1) lookups
    local newState = cjson.encode({status = "LOCKED", u = userId, ts = ts})
    redis.call("HSET", mapKey, seatId, newState)
    return "OK"
  else
    return {err = "ALREADY_LOCKED"}
  end
`;

class LockingService {
  async lockSeat(seatId, userId) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const lockKey = `locks:${seatId}`;
      const mapKey = "map_state";

      const result = await redisClient.eval(lockSeatScript, {
        keys: [lockKey, mapKey],
        arguments: [seatId, userId, LOCK_TTL.toString(), timestamp]
      });

      if (result === 'OK') {
        return { success: true };
      } else if (result.err) {
        return { success: false, error: result.err };
      }
    } catch (err) {
      console.error('Locking error:', err);
      return { success: false, error: 'SERVER_ERROR' };
    }
  }

  async releaseLock(seatId, userId) {
    const lockKey = `locks:${seatId}`;
    const mapKey = "map_state";

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
}

module.exports = new LockingService();
