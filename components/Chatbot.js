import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaRobot } from 'react-icons/fa';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([
    { role: "system", content: "You are an assistant for ISE." }
  ]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const prompts = [
    "What services does ISE offer?",
    "How does ISE support sports marketing?",
    "Can you tell me about ISE's recent projects?",
    "What makes ISE unique in the industry?",
    "How can ISE enhance brand visibility?",
    "What partnerships does ISE have?",
    "How does ISE engage with communities?",
    "What are ISE's future goals?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (message) => {
    if (message.trim() === '') return;

    setConversationStarted(true);

    const userMessage = { role: "user", content: message };
    setMessages(prevMessages => [...prevMessages, { text: message, isUser: true }]);
    setConversationHistory(prevHistory => [...prevHistory, userMessage]);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...conversationHistory, userMessage] }),
    });

    const data = await response.json();

    const botMessage = { role: "assistant", content: data.response };
    setMessages(prevMessages => [...prevMessages, { text: data.response, isUser: false }]);
    setConversationHistory(prevHistory => [...prevHistory, botMessage]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-full sm:max-w-2xl mx-auto border-2 border-gray-300">
      <div className="space-y-4 h-80 sm:h-96 overflow-y-auto"> {/* Updated this line */}
        {!conversationStarted && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                onClick={() => handleSubmit(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-center`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {!message.isUser && (
                <FaRobot className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3" />
              )}
              {message.isUser && (
                <FaUserCircle className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3" />
              )}
              <div className={`${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2 sm:px-5 sm:py-3 max-w-xs sm:max-w-md shadow-md`}>
                <ReactMarkdown className="prose prose-sm">
                  {message.text}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }} className="mt-4 flex items-center space-x-2 sm:space-x-3">
        <input
          type="text"
          className="flex-grow rounded-full p-3 sm:p-4 border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}