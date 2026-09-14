// ChatPage.jsx — Real-time Socket.io chat, modern bubble UI
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

let socket;

export default function ChatPage() {
    const { roomId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [typingUser, setTypingUser] = useState("");
    const [connected, setConnected] = useState(false);
    const bottomRef = useRef(null);
    const typingTimer = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        socket = io({ auth: { token: localStorage.getItem("token") } });

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        socket.emit("join_room", roomId);

        socket.on("message_history", (history) => setMessages(history));
        socket.on("new_message", (msg) =>
            setMessages((prev) => [...prev, msg]),
        );
        socket.on("user_typing", (name) => setTypingUser(name));
        socket.on("user_stop_typing", () => setTypingUser(""));

        return () => socket.disconnect();
    }, [roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUser]);

    function handleTyping(e) {
        setText(e.target.value);
        socket.emit("typing", { roomId, senderName: user.name });
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(
            () => socket.emit("stop_typing", { roomId }),
            1500,
        );
    }

    function sendMessage(e) {
        e.preventDefault();
        if (!text.trim()) return;
        socket.emit("send_message", {
            roomId,
            senderId: user.id,
            senderName: user.name,
            text: text.trim(),
        });
        socket.emit("stop_typing", { roomId });
        setText("");
        inputRef.current?.focus();
    }

    function formatTime(iso) {
        return new Date(iso).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Group consecutive messages from same sender
    const grouped = messages.map((msg, i) => ({
        ...msg,
        isFirst: i === 0 || messages[i - 1].senderId !== msg.senderId,
        isLast:
            i === messages.length - 1 ||
            messages[i + 1].senderId !== msg.senderId,
    }));

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] max-w-2xl mx-auto">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
                <Link to="/dashboard" className="btn btn-ghost btn-sm p-2">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">
                        Private Chat
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-300"}`}
                        />
                        {connected ? "Connected" : "Connecting…"}
                    </p>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1 bg-slate-50">
                {messages.length === 0 && !typingUser && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            <Send size={22} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs mt-1">
                            Start the conversation 👇
                        </p>
                    </div>
                )}

                {grouped.map((msg) => {
                    const mine = msg.senderId === user.id;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${mine ? "justify-end" : "justify-start"} ${msg.isFirst ? "mt-4" : "mt-0.5"}`}
                        >
                            <div
                                className={`flex flex-col ${mine ? "items-end" : "items-start"} max-w-[72%]`}
                            >
                                {!mine && msg.isFirst && (
                                    <p className="text-xs font-semibold text-slate-500 mb-1 ml-1">
                                        {msg.senderName}
                                    </p>
                                )}
                                <div
                                    className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                        mine
                                            ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
                                            : "bg-white text-slate-800 rounded-2xl rounded-bl-sm border border-slate-100"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.isLast && (
                                    <p
                                        className={`text-[11px] mt-1 mx-1 ${mine ? "text-slate-400" : "text-slate-400"}`}
                                    >
                                        {formatTime(msg.createdAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Typing indicator */}
                {typingUser && (
                    <div className="flex items-center gap-2 mt-4">
                        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">{typingUser}</p>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 bg-white border-t border-slate-200">
                <form
                    onSubmit={sendMessage}
                    className="flex gap-2 items-center"
                >
                    <input
                        ref={inputRef}
                        className="input flex-1"
                        placeholder="Type a message…"
                        value={text}
                        onChange={handleTyping}
                    />
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="btn btn-primary p-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ width: "42px", height: "42px", padding: "0" }}
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
