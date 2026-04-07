const { createClient } = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const redisClient = createClient({ url: `redis://${REDIS_HOST}:6379` });
redisClient.connect();

const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 1; // per 1 second

const rateLimiter = async (socket, next) => {
  const userId = socket.user.sub;
  const key = `ratelimit:${userId}`;

  try {
    const requests = await redisClient.incr(key);
    if (requests === 1) {
      await redisClient.expire(key, RATE_WINDOW);
    }

    if (requests > RATE_LIMIT) {
      return next(new Error('Rate limit exceeded'));
    }
    next();
  } catch (err) {
    next(new Error('Rate limiter error'));
  }
};

module.exports = rateLimiter;
