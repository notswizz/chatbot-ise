import { FaCheckCircle } from 'react-icons/fa';

export default function NameForm({ input, setInput, handleNameSubmit }) {
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-300 to-blue-400 p-4 sm:p-8">
      <form onSubmit={(e) => { e.preventDefault(); handleNameSubmit(input); }} className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4">
        <div className="flex justify-center mb-4">
          <img src="/iselogo.png" alt="ISE Logo" className="h-32 sm:h-64 w-auto" />
        </div>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            className="rounded-full p-3 sm:p-4 border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            placeholder="Enter your name..."
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
  );
}