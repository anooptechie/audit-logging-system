const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  console.log("Redis client connected (API)");
});

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

module.exports = redisClient;
