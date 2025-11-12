import RecommendationGrid from "./RecommendationGrid";

const RecommendationsField = ({ recommendations, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-x-2 text-gray-600 dark:text-neutral-400">
          <svg
            className="animate-spin size-5"
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
          <span>Loading recommendations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-x-2 px-4 py-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl dark:bg-red-800/10 dark:border-red-800/20 dark:text-red-400">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (recommendations.length <= 0) {
    return null;
  }

  return (
    <div className="RecommendationsField space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
        Recommended Songs
      </h2>
      <RecommendationGrid recommendations={recommendations} />
    </div>
  );
};

export default RecommendationsField;
