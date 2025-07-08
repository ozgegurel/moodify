import { Spotify } from "./Spotify";

const RecommendationGrid = ({ recommendations }) => {
  return (
    <div className="RecommendationGrid grid gap-4">
      {recommendations.map((track) => (
        <div
          key={track.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div className="flex flex-col">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {track.name}
              </h3>
              <p className="text-gray-600">
                {track.artists?.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <div className="px-4 pb-4">
              <Spotify link={track.external_urls?.spotify} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationGrid;
