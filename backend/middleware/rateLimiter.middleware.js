const rateLimit = require('express-rate-limit');
const redis = require('../config/redis');
const { RedisStore } = require('rate-limit-redis');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the 100 requests in 15 minutes limit. Please try again later.',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again after 15 minutes.',
      limit: 100,
      windowMs: 15 * 60 * 1000
    });
  },
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  skip: (req) => {
    return req.path === '/health' || req.path === '/';
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

module.exports = { rateLimiter };
