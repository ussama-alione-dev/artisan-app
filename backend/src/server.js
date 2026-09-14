// server.js — express + socket.io entry point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});

// middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/artisans", require("./routes/artisans"));
app.use("/api/demandes", require("./routes/demandes"));
app.use("/api/messages", require("./routes/messages"));

// socket.io
require("./socket")(io);

// 404 + error handlers (must come after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
