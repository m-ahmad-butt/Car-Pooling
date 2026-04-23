const Redis = require('ioredis');

class RedisClient {
  constructor() {
    if (!RedisClient.instance) {
      this.client = new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        lazyConnect: false,
      });

      this.client.on('connect', () => console.log('Redis connected'));
      this.client.on('error', (err) => console.error('Redis error:', err));
      
      RedisClient.instance = this;
    }
    return RedisClient.instance;
  }

  getClient() {
    return this.client;
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      console.log('Redis disconnected');
    }
  }
}

const redisInstance = new RedisClient();
Object.freeze(redisInstance);

module.exports = redisInstance.getClient();
module.exports.disconnect = () => redisInstance.disconnect();
