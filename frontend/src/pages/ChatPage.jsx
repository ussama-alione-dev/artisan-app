// pages/ChatPage.jsx — Real-time private chat via Socket.io
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket;

export default function ChatPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState('');
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    // Connect socket
    socket = io({ auth: { token: localStorage.getItem('token') } });

    socket.emit('join_room', roomId);

    socket.on('message_history', (history) => {
      setMessages(history);
    });

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('user_typing', (name) => {
      setTyping(`${name} is typing…`);
    });

    socket.on('user_stop_typing', () => {
      setTyping('');
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleTyping(e) {
    setText(e.target.value);
    socket.emit('typing', { roomId, senderName: user.name });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit('stop_typing', { roomId });
    }, 1500);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('send_message', {
      roomId,
      senderId: user.id,
      senderName: user.name,
      text: text.trim(),
    });
    socket.emit('stop_typing', { roomId });
    setText('');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      <h1 className="text-xl font-bold text-gray-800 mb-4">💬 Chat</h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow p-4 space-y-3 mb-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hello! 👋</p>
        )}
        {messages.map(msg => {
          const isMine = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMine
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {!isMine && (
                  <p className="text-xs font-semibold text-blue-600 mb-1">{msg.senderName}</p>
                )}
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      {typing && <p className="text-xs text-gray-400 mb-1 px-1">{typing}</p>}

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message…"
          value={text}
          onChange={handleTyping}
        />
        <button type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 text-sm font-medium">
          Send
        </button>
      </form>
    </div>
  );
}
