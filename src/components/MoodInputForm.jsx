const MoodInputForm = ({ inputText, setInputText, loading, handleSubmit }) => {
  return (
    <form className="moodInputForm" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="How are you feeling? Describe your mood..."
          className="p-3 sm:p-4 block w-full border-2 border-gray-300 rounded-full sm:text-sm focus:border-gray-500 focus:ring-2 focus:ring-gray-400 focus:outline-none disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:border-gray-400 dark:focus:ring-gray-500 pr-20"
        />
        <div className="absolute top-1/2 end-2 -translate-y-1/2">
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="size-8 sm:size-9 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-400 transition-colors dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:ring-gray-400"
          >
            {loading ? (
              <svg
                className="animate-spin shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MoodInputForm;
