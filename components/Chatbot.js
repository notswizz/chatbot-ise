import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaRobot, FaCheckCircle, FaRedo } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([
    { role: "system", content: "You are an assistant for ISE." }
  ]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const prompts = [
    "What services does ISE offer?",
    "An EMAIL sent me here...",
    "Can you tell me about ISE's past projects?",
    "What current partnerships does ISE have?",

  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isResponding) {
      scrollToBottom();
    }
  }, [messages]);

  const handleNameSubmit = (name) => {
    if (name.trim() === '') return;
    setUserName(name);
    localStorage.setItem('userName', name);
    setInput('');
  };

  const handleResetName = () => {
    localStorage.removeItem('userName');
    setUserName('');
    setInput('');
    window.location.reload();
  };

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
      body: JSON.stringify({ messages: [...conversationHistory, userMessage], userName }),
    });

    const data = await response.json();

    const botMessage = { role: "assistant", content: data.response };
    setMessages(prevMessages => [...prevMessages, { text: data.response, isUser: false }]);
    setConversationHistory(prevHistory => [...prevHistory, botMessage]);

    setTimeout(() => {
      setIsResponding(false);
    }, 3000);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
<div className="flex flex-col h-full border-2 border-blue-300 rounded-lg">
      <div className="flex-grow overflow-y-auto space-y-4 p-4">
        {!userName ? (
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-300 to-blue-400 p-4 sm:p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleNameSubmit(input); }} className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <img src="/iselogo.png" alt="ISE Logo" className="h-32 sm:h-64 w-auto" />
              </div>
             
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  className="rounded-full p-3 sm:p-4 border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                  placeholder="Enter your email..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                {isValidEmail(input) && (
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full h-12 rounded-full bg-green-600 text-white hover:bg-green-700 font-bold transition shadow-md"
                  >
                    <FaCheckCircle className="h-6 w-6 mr-2" />
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-end p-2">
              <button
                onClick={handleResetName}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition shadow-sm"
              >
                <FaRedo className="h-4 w-4" />
              </button>
            </div>
            {!conversationStarted && (
              <div className="grid grid-cols-1 py-4 px-4 sm:grid-cols-1 gap-10">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs sm:text-sm font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
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
                    <FaRobot className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                  )}
                  {message.isUser && (
                    <FaUserCircle className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                  )}
                  <div className={`${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2 sm:px-5 sm:py-3 max-w-xs sm:max-w-md shadow-md`}>
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
                        typeSpeed={30}
                        deleteSpeed={30}
                        delaySpeed={500}
                        onType={scrollToBottom}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      {userName && (
        <div className="sticky bottom-0 bg-white p-3 sm:p-4 border-t border-gray-200">
          {isResponding ? (
            <div className="flex items-center justify-center space-x-3">
              <motion.button
                className="flex items-center justify-center w-full h-10 sm:h-12 rounded-lg bg-gray-300 text-gray-700 font-bold transition shadow-md"
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
                className="flex-grow rounded-full p-3 sm:p-4 border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold transition shadow-md ${
                  input.trim() === '' ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                disabled={input.trim() === ''}
              >
                <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}