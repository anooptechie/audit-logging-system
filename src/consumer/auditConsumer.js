const redis = require("../config/redis");
const AuditEvent = require("../models/AuditEvent");

const QUEUE_KEY = "audit_events";
const DLQ_KEY = "audit_events_dlq";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function saveWithRetry(eventData) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const auditEvent = new AuditEvent(eventData);

      // TEMP: use this only when testing retries
      // throw new Error("Simulated DB failure");

      await auditEvent.save();
      console.log("Audit event saved");
      return;
    } catch (err) {
      // Duplicate → expected, stop immediately
      if (err.code === 11000) {
        console.warn("Duplicate audit event ignored (idempotency hit)");
        return;
      }

      // Validation error → do not retry
      if (err.name === "ValidationError") {
        console.error("Invalid audit event, skipping:", err.message);
        return;
      }

      // Retryable error
      if (attempt < MAX_RETRIES) {
        console.warn(
          `Audit save failed (attempt ${attempt}/${MAX_RETRIES}), retrying...`
        );
        await delay(RETRY_DELAY_MS);
      } else {
        // Retries exhausted → bubble up to DLQ
        throw err;
      }
    }
  }
}

async function pushToDLQ(eventData, error) {
  const dlqPayload = {
    event: eventData,
    error: {
      message: error.message,
      stack: error.stack
    },
    failedAt: new Date().toISOString()
  };

  await redis.lpush(DLQ_KEY, JSON.stringify(dlqPayload));
  console.error("Audit event moved to DLQ");
}

async function startAuditConsumer() {
  console.log("Audit Consumer Started");

  while (true) {
    let eventData;

    try {
      const result = await redis.brpop(QUEUE_KEY, 0);

      // Safety guard
      if (!result || result.length < 2) {
        continue;
      }

      const payload = result[1];
      eventData = JSON.parse(payload);

      await saveWithRetry(eventData);
    } catch (err) {
      console.error("Audit consumer error, sending to DLQ");

      if (eventData) {
        try {
          await pushToDLQ(eventData, err);
        } catch (dlqErr) {
          console.error("Failed to push event to DLQ", dlqErr);
        }
      }
    }
  }
}

module.exports = startAuditConsumer;
