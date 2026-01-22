require("dotenv").config();
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

const QUEUE_KEY = "audit_events";

async function sendAuditEvent() {
  const auditEvent = {
    idempotencyKey: "inventory-update-item-789-req-021",
    actor: {
      actorId: "user-997",
      actorType: "user",
      role: "manager",
    },
    action: {
      verb: "UPDATE",
      type: "INVENTORY_UPDATE",
      resourceType: "inventory",
      resourceId: "item-7899",
    },
    changes: {
      quantity: { from: 10, to: 15 },
    },
    context: {
      requestId: "req-producer-002",
      userAgent: "producer-script",
    },
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(auditEvent));

  console.log("Audit event pushed to Redis queue");

  redis.disconnect();
}

sendAuditEvent().catch((err) => {
  console.error("Producer", err);
  redis.disconnect();
});
