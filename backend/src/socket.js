// socket.js — Socket.io real-time chat handler
const { addMessage, getMessages } = require('./store');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Join a private chat room (roomId = sorted userId pair)
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      const history = getMessages(roomId);
      socket.emit('message_history', history);
    });

    // Send a message
    socket.on('send_message', ({ roomId, senderId, senderName, text }) => {
      const msg = addMessage(roomId, { senderId, senderName, text });
      io.to(roomId).emit('new_message', msg);
    });

    // Typing indicator
    socket.on('typing', ({ roomId, senderName }) => {
      socket.to(roomId).emit('user_typing', senderName);
    });

    socket.on('stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('user_stop_typing');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
