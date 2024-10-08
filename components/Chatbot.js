import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaRedo } from 'react-icons/fa';
import NameForm from './NameForm';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import PromptButtons from './PromptButtons';

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
    "Can you tell me about ISE's past projects?",
    "What current partnerships does ISE have?",
    "An EMAIL sent me here...",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isResponding) {
      scrollToBottom();
    }
  }, [messages, isResponding]);

  const handleNameSubmit = (name) => {
    if (name.trim() === '') return;
    setUserName(name);
    localStorage.setItem('userName', name);
    setInput('');
  };



  const handleSubmit = async (message) => {
    if (message.trim() === '') return;

    setConversationStarted(true);
    setIsResponding(true);

    const userMessage = { role: "user", content: message };
    setMessages(prevMessages => [...prevMessages, { text: message, isUser: true }]);
    setConversationHistory(prevHistory => [...prevHistory, userMessage]);
    setInput('');

    const email = detectEmail(message);
    if (email) {
      await logEmail(email);
    }

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

  const detectEmail = (message) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = message.match(emailRegex);
    return match ? match[0] : null;
  };

  const logEmail = async (email) => {
    try {
      const response = await fetch('/api/add-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'email',
          data: { email },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Email logged successfully:', result.message);
      } else {
        console.error('Error logging email:', result.error);
      }
    } catch (error) {
      console.error('Error logging email:', error);
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-blue-300 rounded-lg">
      <div className="flex-grow flex flex-col overflow-hidden">
        {!userName ? (
          <NameForm input={input} setInput={setInput} handleNameSubmit={handleNameSubmit} />
        ) : (
          <>
           
            {!conversationStarted && (
              <PromptButtons prompts={prompts} handleSubmit={handleSubmit} />
            )}
            <div className="flex-grow overflow-y-auto space-y-4 p-4">
              <AnimatePresence initial={false}>
                <MessageList messages={messages} />
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
      {userName && (
        <MessageInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isResponding={isResponding}
        />
      )}
    </div>
  );
}