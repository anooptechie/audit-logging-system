const express = require("express");
const AuditEvent = require("../models/AuditEvent");

const router = express.Router();

router.post("/events", async (req, res) => {
  try {
    const eventData = req.body;

    if (!eventData.actor || !eventData.action) {
      return res.status(400).json({
        error: "actor and action are required",
      });
    }

    const auditEvent = new AuditEvent(eventData);

    await auditEvent.save();

    return res.status(201).json({
      message: "Audit event recorded",
    });
  } catch (err) {
    console.error("Failed to record audit event", err);
    return res.status(500).json({
      error: "Internal audit service error",
    });
  }
});


// GET /audit/events
// Read audit events with filters
router.get("/events", async (req, res) => {
  try {
    const {
      actorId,
      actorType,
      actionType,
      resourceType,
      startTime,
      endTime,
      limit = 20,
      cursor
    } = req.query;

    const query = {};

    // Actor filters
    if (actorId) query["actor.actorId"] = actorId;
    if (actorType) query["actor.actorType"] = actorType;

    // Action filters
    if (actionType) query["action.type"] = actionType;
    if (resourceType) query["action.resourceType"] = resourceType;

    // Time range filter
    if (startTime || endTime) {
      query.timestamp = {};
      if (startTime) query.timestamp.$gte = new Date(startTime);
      if (endTime) query.timestamp.$lte = new Date(endTime);
    }

    // Cursor-based pagination (using _id)
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const events = await AuditEvent.find(query)
      .sort({ _id: -1 })
      .limit(Number(limit) + 1);

    const hasNextPage = events.length > limit;
    const results = hasNextPage ? events.slice(0, limit) : events;

    const nextCursor = hasNextPage
      ? results[results.length - 1]._id
      : null;

    return res.status(200).json({
      data: results,
      pagination: {
        nextCursor,
        limit: Number(limit)
      }
    });
  } catch (err) {
    console.error("Failed to fetch audit events", err);
    return res.status(500).json({
      error: "Failed to fetch audit events"
    });
  }
});

module.exports = router;
