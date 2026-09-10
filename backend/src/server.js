// server.js — Express + Socket.io entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', credentials: true },
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artisans', require('./routes/artisans'));
app.use('/api/demandes', require('./routes/demandes'));
app.use('/api/messages', require('./routes/messages'));

// Socket.io
require('./socket')(io);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Socket.io is already required above
// Seed demo data then start listening
const seed = require('./seed');
const PORT = process.env.PORT || 5000;

seed().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
