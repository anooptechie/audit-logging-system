// const express = require("express");
// const router = express.Router();
// const metrics = require("../metrics/consumerMetrics");

// router.get("/metrics", (req, res) => {
//   res.json({
//     status: "ok",
//     consumerStartedAt: metrics.consumerStartedAt,
//     lastEventProcessedAt: metrics.lastEventProcessedAt,
//     counters: {
//       eventsProcessed: metrics.eventsProcessed,
//       duplicatesIgnored: metrics.duplicatesIgnored,
//       retryAttempts: metrics.retryAttempts,
//       dlqEvents: metrics.dlqEvents,
//     },
//   });
// });

// module.exports = router;
