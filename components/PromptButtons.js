export default function PromptButtons({ prompts, handleSubmit }) {
  return (
    <div className="grid grid-cols-1 py-4 px-4 sm:grid-cols-1 gap-3">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          className={`text-white text-sm sm:text-base font-semibold px-6 py-4 sm:px-8 sm:py-5 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 ${
            index === prompts.length - 1
              ? 'bg-gradient-to-r from-green-400 to-green-600 focus:ring-green-400'
              : 'bg-gradient-to-r from-blue-500 to-blue-700 focus:ring-blue-400'
          }`}
          onClick={() => handleSubmit(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}