
export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is missing. Check Vercel Environment Variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const idea = body.idea;

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
You are the professional AI story director of Creator Studio.

Create a detailed video storyboard based on this idea:
${idea}

Return ONLY valid JSON with this structure:

{
  "title": "Video title",
  "logline": "Short story summary",
  "characters": [
    {
      "name": "Character name",
      "description": "Personality and role",
      "visual_identity": "Detailed appearance description to maintain consistency"
    }
  ],
  "scenes": [
    {
      "scene_number": 1,
      "title": "Scene title",
      "duration_seconds": 10,
      "narration": "Narrator voiceover",
      "visual_prompt": "Detailed image generation prompt",
      "camera_motion": "Camera movement",
      "dialogue": "Character dialogue, if any"
    }
  ]
}

Requirements:
- Create 6 scenes.
- Make the story engaging and coherent.
- Keep character appearances consistent in every scene.
- Write detailed visual prompts.
- Include a beginning, middle and satisfying ending.
- Make the story suitable for a general audience.
`;

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
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return Response.json(
        { error: data.error?.message || "Gemini generation failed." },
        { status: response.status }
      );
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    if (!text) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    const storyboard = JSON.parse(text);

    return Response.json({
      success: true,
      storyboard
    });

  } catch (error) {
    console.error("Generation error:", error);

    return Response.json(
      { error: "Something went wrong while generating your storyboard." },
      { status: 500 }
    );
  }
}

