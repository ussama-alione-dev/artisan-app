// routes/messages.js
const express = require("express");
const { param } = require("express-validator");
const { getRoomMessages } = require("../controllers/messageController");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.get(
  "/:roomId",
  requireAuth,
  [param("roomId", "roomId is required").notEmpty()],
  validate,
  getRoomMessages
);

module.exports = router;
