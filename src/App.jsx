import { useState, useRef, useEffect } from "react";
//import { moodRecommendations } from "./data/recommendations";
import { fetchGeminiRecommendations } from "./services/gemini";
import { getSpotifyTracks } from "./services/spotify";
import MoodInputForm from "./components/MoodInputForm";
import RecommendationsField from "./components/RecommendationsField";
import logoBlack from "./assets/moodify-light.png";
import logoWhite from "./assets/moodify-dark.png";
// import { preview } from "vite";

function App() {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const recommendationsRef = useRef(null);

  // Dark mode state - check localStorage first, then system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return saved === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode class to HTML element on mount and when state changes
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.add("light");
    }
    localStorage.setItem("darkMode", String(isDark));
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      if (newValue) {
        html.classList.add("dark");
      } else {
        html.classList.add("light");
      }
      localStorage.setItem("darkMode", String(newValue));
      return newValue;
    });
  };

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

  const hasResults = recommendations.length > 0 || error;

  return (
    <div
      className={`${
        hasResults ? "min-h-screen" : "h-screen"
      } flex flex-col bg-white dark:bg-neutral-900 pb-6 overflow-y-auto relative`}
    >
      {/* Dark Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-500 dark:focus:ring-offset-neutral-900"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <svg
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div
        className={`flex-1 flex flex-col ${
          !hasResults ? "justify-center" : "pt-8 sm:pt-12"
        }`}
      >
        {/* Header Section - Centered */}
        <div
          className={`max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8 ${
            !hasResults ? "-mt-20" : ""
          }`}
        >
          <div className="mb-4 flex justify-center items-center">
            {/* Logo/Brand */}
            <div className="flex-none rounded-md inline-block focus:outline-hidden focus:opacity-80">
              <img
                src={logoBlack}
                alt="Moodify Logo"
                className="h-12 sm:h-16 w-auto dark:hidden"
              />
              <img
                src={logoWhite}
                alt="Moodify Logo"
                className="h-12 sm:h-16 w-auto hidden dark:block"
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            Discover Music for Your Mood
          </h2>
          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            Let AI curate the perfect soundtrack for how you're feeling
          </p>
        </div>

        {/* Mood Input Form - Centered */}
        <div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <MoodInputForm
            inputText={inputText}
            setInputText={setInputText}
            loading={loading}
            handleSubmit={handleSubmit}
          />
        </div>

        {/* Recommendations - Centered with scroll */}
        <div
          ref={recommendationsRef}
          className="mt-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8"
        >
          <RecommendationsField
            recommendations={recommendations}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Footer - Centered */}
      <footer className="mt-auto max-w-4xl text-center mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <p className="text-xs text-gray-600 dark:text-neutral-500">
          © 2025 Moodify. Powered by AI & Spotify.
        </p>
      </footer>
    </div>
  );
}

export default App;
//preview
