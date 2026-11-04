export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const prompt = body.prompt;
    const aspectRatio = body.aspectRatio || "16:9";

    const allowedRatios = ["16:9", "9:16", "1:1"];

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return Response.json(
        { error: "Please enter an image prompt." },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return Response.json(
        { error: "Prompt must be under 2000 characters." },
        { status: 400 }
      );
    }

    if (!allowedRatios.includes(aspectRatio)) {
      return Response.json(
        { error: "Invalid image aspect ratio." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent",
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
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: "1K"
            }
          }
        }),
        signal: AbortSignal.timeout(55000)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Image generation error:", data);

      return Response.json(
        {
          error: data.error?.message || "Image generation failed."
        },
        { status: response.status }
      );
    }

    const parts = data.candidates?.[0]?.content?.parts || [];

    const imagePart = parts.find(
      part => part.inlineData?.data
    );

    if (!imagePart) {
      return Response.json(
        { error: "No image was returned. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
    });

  } catch (error) {
    console.error("Image API error:", error);

    return Response.json(
      { error: "Image generation failed. Please try again." },
      { status: 500 }
    );
  }
}
