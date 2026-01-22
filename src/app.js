const express = require("express");
const healthRoutes = require("./routes/health.routes")
const auditRoutes = require("./routes/audit.routes")
const metricsRoute = require("./metrics/consumerMetrics")

const app = express()

app.use(express.json())
app.use("/health", healthRoutes)
app.use("/audit", auditRoutes)
// app.use("/health", metricsRoute)

module.exports = app;