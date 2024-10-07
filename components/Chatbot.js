import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaRobot, FaCheckCircle } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([
    { role: "system", content: "You are an assistant for ISE." }
  ]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
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

  useEffect(() => {
    if (!isResponding) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (message) => {
    if (message.trim() === '') return;

    setConversationStarted(true);
    setIsResponding(true);

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

    // Show "..." for 3 seconds
    setTimeout(() => {
      setIsResponding(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-4 p-4">
        {!conversationStarted && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
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
                <FaRobot className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10 mr-3" />
              )}
              {message.isUser && (
                <FaUserCircle className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10 mr-3" />
              )}
              <div className={`${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-5 py-3 max-w-xs sm:max-w-md shadow-md`}>
                {message.isUser ? (
                  <ReactMarkdown className="prose prose-sm">
                    {message.text}
                  </ReactMarkdown>
                ) : (
                  <Typewriter
                    words={[message.text]}
                    loop={1}
                    cursor
                    cursorStyle="_"
                    typeSpeed={30}  // Faster typing speed
                    deleteSpeed={30} // Faster deleting speed
                    delaySpeed={500} // Shorter delay before starting
                    onType={scrollToBottom} // Scroll as the message is typed
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
        {isResponding ? (
          <div className="flex items-center justify-center space-x-3">
            <motion.button
              className="flex items-center justify-center w-full h-12 rounded-lg bg-gray-300 text-gray-700 font-bold transition shadow-md"
              disabled
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              ...
            </motion.button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }} className="flex items-center space-x-3">
            <input
              type="text"
              className="flex-grow rounded-full p-4 border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition shadow-md ${
                input.trim() === '' ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              disabled={input.trim() === ''}
            >
              <FaCheckCircle className="h-6 w-6" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}