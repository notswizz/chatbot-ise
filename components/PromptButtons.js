export default function PromptButtons({ prompts, handleSubmit }) {
    return (
      <div className="grid grid-cols-1 py-4 px-4 sm:grid-cols-1 gap-6">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            className={`text-white text-sm sm:text-base font-semibold px-5 py-3 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 ${
              index === prompts.length - 1
                ? 'bg-gradient-to-r from-green-500 to-green-700 focus:ring-green-500'
                : 'bg-gradient-to-r from-blue-600 to-blue-800 focus:ring-blue-500'
            }`}
            onClick={() => handleSubmit(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    );
  }