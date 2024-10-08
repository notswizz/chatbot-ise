import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function MessageInput({ input, setInput, handleSubmit, isResponding }) {
  return (
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
  );
}