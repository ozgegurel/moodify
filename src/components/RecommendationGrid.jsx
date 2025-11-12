import { Spotify } from "./Spotify";

const RecommendationGrid = ({ recommendations }) => {
  return (
    <div className="RecommendationGrid flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto">
      {recommendations.map((track) => (
        <div
          key={track.id}
          className="group w-full bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-neutral-700 transition-all duration-300 overflow-hidden"
        >
          <div className="flex flex-col">
            <div className="p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 text-center">
                {track.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4 text-center">
                {track.artists?.map((artist) => artist.name).join(", ") ||
                  "Unknown Artist"}
              </p>
            </div>
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <Spotify link={track.external_urls?.spotify} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationGrid;
