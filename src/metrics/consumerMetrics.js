const consumerMetrics = {
  consumerStartedAt: new Date(),
  lastEventProcessedAt: null,

  eventsProcessed: 0,
  duplicatesIgnored: 0,
  retryAttempts: 0,
  dlqEvents: 0
};

module.exports = consumerMetrics;
