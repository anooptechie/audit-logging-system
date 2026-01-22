const express = require("express");
const router = express.Router();
const metrics = require("../metrics/consumerMetrics") 

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "audit-logging-service",
    timestamp: new Date().toISOString(),
  });
});

router.get("/metrics", (req, res) => {
  res.json({
    status: "ok",
    consumerStartedAt: metrics.consumerStartedAt,
    lastEventProcessedAt: metrics.lastEventProcessedAt,
    counters: {
      eventsProcessed: metrics.eventsProcessed,
      duplicatesIgnored: metrics.duplicatesIgnored,
      retryAttempts: metrics.retryAttempts,
      dlqEvents: metrics.dlqEvents,
    },
  });
});

router.get("/consumer", (req, res) => {
  res.json({
    status: "ok",
    consumerStartedAt: metrics.consumerStartedAt,
    lastHeartbeatAt: metrics.lastHeartbeatAt,
    lastEventProcessedAt: metrics.lastEventProcessedAt
  });
});


module.exports = router