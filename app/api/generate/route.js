export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const { idea } = await request.json();

    if (!idea || typeof idea !== "string" || !idea.trim()) {
      return Response.json(
        { error: "Please enter a video idea." },
        { status: 400 }
      );
    }

    if (idea.length > 2000) {
      return Response.json(
        { error: "Your idea must be under 2000 characters." },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional AI video story director.

Create a detailed storyboard for this idea:
${idea}

Return ONLY valid JSON in this structure:

{
  "title": "Video title",
  "logline": "Short story summary",
  "characters": [
    {
      "name": "Character name",
      "description": "Personality and role",
      "visual_identity": "Detailed consistent appearance"
    }
  ],
  "scenes": [
    {
      "scene_number": 1,
      "title": "Scene title",
      "duration_seconds": 10,
      "narration": "Narration",
      "visual_prompt": "Detailed visual prompt",
      "camera_motion": "Camera movement",
      "dialogue": "Dialogue"
    }
  ]
}

Requirements:
- Create exactly 6 scenes.
- Include beginning, middle and ending.
- Keep character appearance consistent.
- Make every scene visually detailed.
- Make the story engaging and suitable for all audiences.
`;

    let data;
    let lastError;

    // Retry temporary Gemini server errors up to 3 times.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.8,
                maxOutputTokens: 5000
              }
            }),
            signal: AbortSignal.timeout(45000)
          }
        );

        data = await response.json();

        if (response.ok) {
          break;
        }

        lastError = data.error?.message || "Gemini request failed.";

        if (![429, 500, 502, 503, 504].includes(response.status)) {
          return Response.json(
            { error: lastError },
            { status: response.status }
          );
        }

        if (attempt < 2) {
          await new Promise(resolve =>
            setTimeout(resolve, 1500 * (attempt + 1))
          );
        }
      } catch (error) {
        lastError = error.message;

        if (attempt < 2) {
          await new Promise(resolve =>
            setTimeout(resolve, 1500 * (attempt + 1))
          );
        }
      }
    }

    if (!data || !data.candidates?.[0]?.content?.parts) {
      return Response.json(
        {
          error: "Gemini is temporarily busy. Please try again in a minute.",
          details: lastError
        },
        { status: 503 }
      );
    }

    const text = data.candidates[0].content.parts
      .map(part => part.text || "")
      .join("");

    if (!text) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    let storyboard;

    try {
      storyboard = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Gemini returned an invalid storyboard. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      storyboard
    });

  } catch (error) {
    console.error("Generation error:", error);

    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
