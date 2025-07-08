const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const fetchGeminiRecommendations = async (
  input,
  existingTracks = [],
  failedTracks = []
) => {
  // Check if API key is available
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined");
    throw new Error("Gemini API key is not configured");
  }

  let parts = [
    {
      text: `Rol: Deneyimli bir müzik danışmanı ve duygusal analiz uzmanı olarak hareket et. 
      Görev: Kullanıcının sağladığı metni analiz ederek, metindeki duygusal tonları belirle. 
      Bu duygulara uygun 20 popüler şarkı önerisi sun. Her şarkı için: 
      track:ŞARKI_ADI artist:SANATÇI_ADI formatında yaz. 
      Cevap olarak yanlızca bu formatları aralarında | (pipe) karakteri olacak şekilde listeleyerek ver. 
      Başka hiçbir açıklama veya metin ekleme, sadece şarkı listesini ver. 
      Kısıtlamalar: 
      - Sadece Spotify'da bulunan popüler şarkıları öner
      - Her öneri tam olarak track:xxx artist:xxx formatında olmalıdır
      - Şarkı önerileri, metindeki duygusal içeriğe uygun olmalıdır
      ${
        existingTracks.length > 0
          ? `- Aşağıdaki şarkıları önerme çünkü zaten önerildi: ${existingTracks
              .map((t) => `${t.name} - ${t.artists[0].name}`)
              .join(", ")}`
          : ""
      }
      Girdi:'${input}'`,
    },
  ];

  if (failedTracks.length > 0) {
    parts.push({
      text: `Aşağıdaki track-artist listesinden girdiye en uygun olanları seçmeni istiyorum. 
      Her şarkı için track:ŞARKI_ADI artist:SANATÇI_ADI formatında yaz:
      ${failedTracks
        .map((t) => `${t.name} - ${t.artists[0].name}`)
        .join(", ")}`,
    });
  }

  const body = {
    contents: [
      {
        parts,
      },
    ],
  };

  try {
    console.log("Sending request to Gemini API...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    // Extract text from the correct path in the response
    const responseText = data.candidates[0].content.parts[0].text;
    console.log("Response text:", responseText);

    // Find the first line that starts with "track:" and extract everything after it
    const trackListMatch = responseText.match(/track:.*/s);
    if (!trackListMatch) {
      console.error("No track list found in response text:", responseText);
      throw new Error("No track list found in response");
    }

    const trackList = trackListMatch[0];
    console.log("Track list:", trackList);

    // Split by pipe character and trim each entry
    const tracks = trackList.split("|").map((query) => query.trim());
    console.log("Parsed tracks:", tracks);

    return tracks;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new Error(
      `An error occurred while fetching recommendations: ${error.message}`
    );
  }
};

export { fetchGeminiRecommendations };
