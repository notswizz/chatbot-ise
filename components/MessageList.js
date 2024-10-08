import { motion } from 'framer-motion';
import { FaUserCircle, FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Typewriter } from 'react-simple-typewriter';
import { useEffect, useRef } from 'react';

// ... existing imports ...

export default function MessageList({ messages }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="overflow-y-auto max-h-full p-4 space-y-4  sm:p-6 sm:space-y-6">
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
            <FaRobot className="text-indigo-500 w-8 h-8 mr-2 sm:w-10 sm:h-10 sm:mr-4" />
          )}
          {message.isUser && (
            <FaUserCircle className="text-indigo-500 w-8 h-8 mr-2 sm:w-10 sm:h-10 sm:mr-4" />
          )}
          <div className={`${message.isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'} rounded-lg px-3 py-2 max-w-xs sm:max-w-md shadow-md`}>
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
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}