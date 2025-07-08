import RecommendationGrid from "./RecommendationGrid";

const RecommendationsField = ({ recommendations, loading, error }) => {
  if (loading) {
    return (
      <p className="text-center text-gray-600">Loading recommendations...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (recommendations.length <= 0) {
    return (
      <p className="text-center text-gray-600">
        No recommendations found. Try describing your mood!
      </p>
    );
  }

  return (
    <div className="RecommendationsField space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Recommended Songs
      </h2>
      <RecommendationGrid recommendations={recommendations} />
    </div>
  );
};

export default RecommendationsField;
