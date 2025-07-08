// import spotifySample from "../data/spotify_sample.json";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpirationTime = 0;

const getAccessToken = async () => {
  // If we have a valid token that hasn't expired, return it
  if (accessToken && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", SPOTIFY_CLIENT_ID);
    params.append("client_secret", SPOTIFY_CLIENT_SECRET);

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to get access token");
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiration time to 55 minutes from now (tokens expire in 1 hour)
    tokenExpirationTime = Date.now() + 55 * 60 * 1000;
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to get access token");
  }
};

const searchSpotifyTrack = async (query) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Spotify API request failed");
    }

    const data = await response.json();
    if (data.tracks.items.length > 0) {
      return { success: true, track: data.tracks.items[0] };
    }
    return { success: false, query };
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return { success: false, query };
  }
};

export const getSpotifyTracks = async (queries) => {
  try {
    // Process each query in parallel
    const trackPromises = queries.map((query) => searchSpotifyTrack(query));
    const results = await Promise.all(trackPromises);

    // Separate successful and failed searches
    const successfulTracks = results
      .filter((result) => result.success)
      .map((result) => result.track);
    const failedQueries = results
      .filter((result) => !result.success)
      .map((result) => result.query);

    return {
      tracks: successfulTracks,
      failedQueries,
    };
  } catch (error) {
    console.error("Error getting Spotify tracks:", error);
    throw new Error("Failed to get Spotify tracks");
  }
};

export default getSpotifyTracks;
