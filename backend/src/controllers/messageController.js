// controllers/messageController.js — chat message history
const Message = require("../models/Message");

// GET /api/messages/:roomId
exports.getRoomMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({
      createdAt: 1,
    });
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};
