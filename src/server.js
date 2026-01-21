require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const startAuditConsumer = require("./consumer/auditConsumer");

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  startAuditConsumer();             //start the consumer after DB connects:
  app.listen(PORT, () => {
    console.log(`Audit service running on ${PORT}`);
  });
}

startServer();
