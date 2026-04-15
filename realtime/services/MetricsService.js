const { createClient } = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = 6379;

class MetricsService {
  constructor() {
    this.redisClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
    this.redisClient.connect();
  }

  async getLiveMetrics(eventId) {
    const mapKey = `map_state:${eventId}`;
    const allStates = await this.redisClient.hGetAll(mapKey);

    const stats = {
      available: 0,
      locked: 0,
      sold: 0,
      total: Object.keys(allStates).length || 80 // Fallback to 80 if empty
    };

    for (const stateJson of Object.values(allStates)) {
      const state = JSON.parse(stateJson);
      if (state.status === 'AVAILABLE') stats.available++;
      else if (state.status === 'LOCKED') stats.locked++;
      else if (state.status === 'SOLD') stats.sold++;
    }

    return stats;
  }
}

module.exports = new MetricsService();
