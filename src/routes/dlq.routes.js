const express = require("express");
const router = express.Router();
const redis = require("../config/redisClient");

const DLQ_KEY = "audit_events_dlq";
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

router.get("/dlq", async (req, res) => {
  try {
    const limit = Math.min(
      parseInt(req.query.limit, 10) || DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    // Read latest failed events
    const rawEvents = await redis.lrange(DLQ_KEY, 0, limit - 1);

    const events = rawEvents.map((item) => JSON.parse(item));

    res.json({
      status: "ok",
      count: events.length,
      events,
    });
  } catch (err) {
    console.error("Failed to read DLQ", err);
    res.status(500).json({
      status: "error",
      message: "Failed to read DLQ",
    });
  }
});

module.exports = router;
