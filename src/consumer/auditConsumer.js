const redis = require("../config/redis");
const AuditEvent = require("../models/AuditEvent");

const QUEUE_KEY = "audit_events";

async function startAuditConsumer() {
  console.log("Audit Consumer Started");

  while (true) {
    try {
      const result = await redis.brpop(QUEUE_KEY, 0);
      const payload = result[1];

      const eventData = JSON.parse(payload);

      const auditEvent = new AuditEvent(eventData);
      await auditEvent.save()

      console.log("Audit Event Consumed and Saved");
    } catch (err) {
      console.error("Audit consumer error", err);
    }
  }
}

module.exports = startAuditConsumer;
