const { createClient } = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = 6379;

class QueueService {
  constructor() {
    this.redisClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
    this.redisClient.connect();
    this.MAX_ACTIVE = 5; // Límite de 5 personas comprando simultáneamente para pruebas
  }

  async getQueueStatus(eventId) {
    const queueKey = `queue:${eventId}`;
    const activeKey = `active:${eventId}`;
    
    const queueCount = await this.redisClient.zCard(queueKey);
    const activeCount = await this.redisClient.sCard(activeKey);
    
    return {
      queueCount,
      activeCount,
      isHighDemand: activeCount >= this.MAX_ACTIVE
    };
  }

  async joinQueue(eventId, userId) {
    const queueKey = `queue:${eventId}`;
    const activeKey = `active:${eventId}`;
    
    // 1. Ver cuántos hay activos ahora
    const activeCount = await this.redisClient.sCard(activeKey);
    const isAlreadyActive = await this.redisClient.sIsMember(activeKey, userId);
    
    if (isAlreadyActive) return { status: 'ACTIVE', position: 0 };

    // 2. Si hay hueco y no hay nadie esperando en cola, entra directo
    const queueCount = await this.redisClient.zCard(queueKey);
    if (activeCount < this.MAX_ACTIVE && queueCount === 0) {
      await this.redisClient.sAdd(activeKey, userId);
      return { status: 'ACTIVE', position: 0 };
    }

    // 3. Si no, a la cola
    const timestamp = Date.now();
    await this.redisClient.zAdd(queueKey, { score: timestamp, value: userId });
    
    const rank = await this.redisClient.zRank(queueKey, userId);
    return { status: 'QUEUE', position: rank + 1 };
  }

  async checkUserStatus(eventId, userId) {
    const activeKey = `active:${eventId}`;
    const queueKey = `queue:${eventId}`;

    const isActive = await this.redisClient.sIsMember(activeKey, userId);
    if (isActive) return { status: 'ACTIVE' };

    const rank = await this.redisClient.zRank(queueKey, userId);
    return { status: 'QUEUE', position: rank !== null ? rank + 1 : null };
  }

  async leaveActive(eventId, userId) {
    const activeKey = `active:${eventId}`;
    const queueKey = `queue:${eventId}`;

    // Usuario sale de la zona activa
    const removed = await this.redisClient.sRem(activeKey, userId);
    
    if (removed) {
      // Si ha salido alguien, metemos al siguiente de la cola si existe
      const nextUser = await this.redisClient.zRange(queueKey, 0, 0);
      if (nextUser.length > 0) {
        const nextUserId = nextUser[0];
        await this.redisClient.zRem(queueKey, nextUserId);
        await this.redisClient.sAdd(activeKey, nextUserId);
        return nextUserId; // Devolvemos quién ha entrado para poder notificarle por socket si queremos
      }
    }
    return null;
  }

  async leaveQueue(eventId, userId) {
    await this.redisClient.zRem(`queue:${eventId}`, userId);
  }
}

module.exports = new QueueService();
