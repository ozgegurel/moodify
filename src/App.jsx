import { useState } from "react";
//import { moodRecommendations } from "./data/recommendations";
import { fetchGeminiRecommendations } from "./services/gemini";
import { getSpotifyTracks } from "./services/spotify";
import MoodInputForm from "./components/MoodInputForm";
import RecommendationsField from "./components/RecommendationsField";
// import { preview } from "vite";

function App() {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendationsWithRetry = async (input) => {
    let allTracks = [];
    let failedTracks = [];
    let sugestedTrackCount = 5;
    let retryCount = 0;
    const maxRetries = 1; // Maximum 1 retries (total 1 attempts)

    while (allTracks.length < sugestedTrackCount && retryCount < maxRetries) {
      const queries = await fetchGeminiRecommendations(
        input,
        allTracks,
        failedTracks
      );
      const { tracks, failedQueries } = await getSpotifyTracks(queries);

      allTracks = [...allTracks, ...tracks];
      failedTracks = [...failedTracks, ...failedQueries];
      retryCount++;
    }

    return allTracks.slice(0, 5); // Ensure we return at most 5 tracks
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tracks = await getRecommendationsWithRetry(inputText);

      if (tracks.length === 0) {
        setError("No songs found. Please try a different mood description.");
      } else {
        setRecommendations(tracks);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 font-serif italic">
          MOODIFY
        </h1>
        <MoodInputForm
          inputText={inputText}
          setInputText={setInputText}
          loading={loading}
          handleSubmit={handleSubmit}
        />
        <RecommendationsField
          recommendations={recommendations}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;
//preview
