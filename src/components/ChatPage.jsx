import { useEffect, useRef, useState } from 'react';
import StatusBar from './StatusBar';
import { getAssistantReply, SUGGESTED_QUESTIONS } from '../utils/healthAssistant';

let messageIdCounter = 0;
function nextId() {
  messageIdCounter += 1;
  return messageIdCounter;
}

function createMessage(sender, text) {
  return { id: nextId(), sender, text };
}

export default function ChatPage({ dayRecord, onClose }) {
  const [messages, setMessages] = useState(() => [
    createMessage(
      'assistant',
      "Hi! I'm your health assistant. Ask me about your heart rate, sleep, blood oxygen, or today's run.",
    ),
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, createMessage('user', trimmed)]);
    setInput('');
    setIsTyping(true);

    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const reply = getAssistantReply(trimmed, dayRecord);
      setMessages((prev) => [...prev, createMessage('assistant', reply)]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="chat-page">
      <StatusBar />

      <div className="chat-page__header">
        <button className="chat-page__back" onClick={onClose} aria-label="Close chat">
          ‹
        </button>
        <span className="chat-page__avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#031218"
            />
          </svg>
        </span>
        <div className="chat-page__title">
          <h2>Health Assistant</h2>
          <span className="chat-page__status">
            <span className="chat-page__status-dot" />
            Online
          </span>
        </div>
      </div>

      <div className="chat-page__messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble chat-bubble--${m.sender}`}>
            {m.text}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="chat-page__suggestions">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button key={q} className="chat-suggestion" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      <form className="chat-page__composer" onSubmit={handleSubmit}>
        <input
          className="chat-page__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your health..."
        />
        <button className="chat-page__send" type="submit" aria-label="Send" disabled={!input.trim()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l16-8-6 8 6 8-16-8z" fill="#031218" />
          </svg>
        </button>
      </form>
    </div>
  );
}
