const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema(
  {
    actorId: {
      type: String,
      required: true
    },
    actorType: {
      type: String,
      enum: ["user", "system", "job"],
      required: true
    },
    role: {
      type: String
    }
  },
  { _id: false }
);

const ActionSchema = new mongoose.Schema(
  {
    verb: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    resourceType: {
      type: String,
      required: true
    },
    resourceId: {
      type: String
    }
  },
  { _id: false }
);

const ContextSchema = new mongoose.Schema(
  {
    requestId: String,
    jobId: String,
    ip: String,
    userAgent: String
  },
  { _id: false }
);

const AuditEventSchema = new mongoose.Schema(
  {
    schemaVersion: {
      type: Number,
      default: 1
    },

    actor: {
      type: ActorSchema,
      required: true
    },

    action: {
      type: ActionSchema,
      required: true
    },

    changes: {
      type: Object
    },

    context: {
      type: ContextSchema
    },

    metadata: {
      type: Object
    },

    timestamp: {
      type: Date,
      default: () => new Date()
    }
  },
  {
    versionKey: false
  }
);

// Time-based queries
AuditEventSchema.index({ timestamp: -1 });

// Actor-based investigation
AuditEventSchema.index({ "actor.actorId": 1, "actor.actorType": 1 });
// AuditEventSchema.index({ "actor.actorType": 1 });

// Action-based filters
AuditEventSchema.index({ "action.type": 1, "action.resourceType": 1 });
// AuditEventSchema.index({ "action.resourceType": 1 });

// Cursor-based pagination (already indexed by default, but explicit is fine)
// AuditEventSchema.index({ _id: -1 });

module.exports = mongoose.model("AuditEvent", AuditEventSchema);
