// socket.js — socket.io real-time chat handler
const Message = require("./models/Message");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // join a private chat room
    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
      try {
        const history = await Message.find({ roomId }).sort({ createdAt: 1 });
        socket.emit("message_history", history);
      } catch (err) {
        console.error("Failed to load message history:", err.message);
        socket.emit("message_history", []);
      }
    });

    // send a message
    socket.on("send_message", async ({ roomId, senderId, senderName, text }) => {
      try {
        const msg = await Message.create({ roomId, sender: senderId, senderName, text });
        io.to(roomId).emit("new_message", msg);
      } catch (err) {
        console.error("Failed to save message:", err.message);
        socket.emit("message_error", { error: "Could not send message" });
      }
    });

    // typing indicator
    socket.on("typing", ({ roomId, senderName }) => {
      socket.to(roomId).emit("user_typing", senderName);
    });

    socket.on("stop_typing", ({ roomId }) => {
      socket.to(roomId).emit("user_stop_typing");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
