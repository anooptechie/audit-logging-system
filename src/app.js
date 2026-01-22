const express = require("express");
const healthRoutes = require("./routes/health.routes")
const auditRoutes = require("./routes/audit.routes")
const dlqRoutes = require("./routes/dlq.routes")

const app = express()

app.use(express.json())
app.use("/health", healthRoutes)
app.use("/audit", auditRoutes)
app.use("/audit", dlqRoutes)

module.exports = app;