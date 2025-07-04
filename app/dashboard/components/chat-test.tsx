"use client";
import { useEffect, useState } from "react";
import { socket } from "~/lib/utils/socket";

export default function ChatTest() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      console.log("📩 Got message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    socket.emit("message", input);
    setInput(""); // clear input
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">FeedFlow Chat</h1>

      <div className="mt-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="bg-powder-blue  p-2 rounded text-white">
            {msg}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </main>
  );
}
