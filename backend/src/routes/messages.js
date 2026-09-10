// routes/messages.js — Get message history for a room
const express = require('express');
const { getMessages } = require('../store');
const { requireAuth } = require('../middleware');

const router = express.Router();

// GET /api/messages/:roomId
router.get('/:roomId', requireAuth, (req, res) => {
  const messages = getMessages(req.params.roomId);
  res.json(messages);
});

module.exports = router;
