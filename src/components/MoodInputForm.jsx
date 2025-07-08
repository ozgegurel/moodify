const MoodInputForm = ({ inputText, setInputText, loading, handleSubmit }) => {
  return (
    <form className="moodInputForm space-y-4 mb-8" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="How are you feeling? Describe your mood..."
          className="flex-1 border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Get Music'}
        </button>
      </div>
    </form>
  );
};

export default MoodInputForm;   