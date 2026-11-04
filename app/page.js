
"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [mode, setMode] = useState("Text to Video");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [storyboard, setStoryboard] = useState(null);

  async function generate() {
    if (!idea.trim()) {
      setError("Please enter your video idea first.");
      return;
    }

    setLoading(true);
    setError("");
    setStoryboard(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idea })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed.");
      }

      setStoryboard(data.storyboard);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">
      <nav className="navbar">
        <div className="logo">
          ✦ Creator<span>Studio</span>
        </div>
        <button className="profile">M</button>
      </nav>

      <section className="hero">
        <div className="tag">✦ YOUR AI CREATIVE WORKSPACE</div>
        <h1>
          Turn your ideas into
          <br />
          <span>extraordinary videos.</span>
        </h1>
        <p>
          Create stories, generate scenes and bring
          your imagination to life.
        </p>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <h2>Create something amazing</h2>
          <span>AI WORKSPACE</span>
        </div>

        <div className="tabs">
          {["Text to Video", "Image to Video", "Video to Video"].map(item => (
            <button
              key={item}
              className={mode === item ? "active" : ""}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="prompt-box">
          <label>YOUR CREATIVE IDEA</label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Describe your video idea... For example, five animal friends discover a mysterious jungle treasure."
          />
          <div className="prompt-footer">
            <span>{idea.length} characters</span>
            <span>✦ GEMINI AI</span>
          </div>
        </div>

        <div className="settings">
          <div>
            <label>VIDEO FORMAT</label>
            <select>
              <option>16:9 Landscape</option>
              <option>9:16 Portrait</option>
              <option>1:1 Square</option>
            </select>
          </div>

          <div>
            <label>VISUAL STYLE</label>
            <select>
              <option>Cinematic</option>
              <option>3D Animation</option>
              <option>Realistic</option>
              <option>Anime</option>
              <option>Cartoon</option>
            </select>
          </div>

          <div>
            <label>DURATION</label>
            <select>
              <option>30 Seconds</option>
              <option>1 Minute</option>
              <option>2 Minutes</option>
              <option>3 Minutes</option>
            </select>
          </div>
        </div>

        <button
          className="generate"
          onClick={generate}
          disabled={loading}
        >
          {loading ? "✦ Creating your storyboard..." : "✦ Generate Storyboard"}
        </button>

        {error && (
          <div className="result">
            ⚠️ {error}
          </div>
        )}
      </section>

      {storyboard && (
        <section className="workspace" style={{ marginTop: 30 }}>
          <div className="section-heading">
            <h2>{storyboard.title}</h2>
            <span>AI GENERATED</span>
          </div>

          <p>{storyboard.logline}</p>

          <h3 style={{ marginTop: 25, marginBottom: 15 }}>
            Characters
          </h3>

          {storyboard.characters?.map((character, index) => (
            <article
              key={index}
              className="result"
              style={{ marginBottom: 12 }}
            >
              <h3>{character.name}</h3>
              <p>{character.description}</p>
              <p>
                <strong>Visual identity:</strong>{" "}
                {character.visual_identity}
              </p>
            </article>
          ))}

          <h3 style={{ marginTop: 30, marginBottom: 15 }}>
            Your scenes
          </h3>

          {storyboard.scenes?.map(scene => (
            <article
              key={scene.scene_number}
              className="result"
              style={{ marginBottom: 15 }}
            >
              <h3>
                Scene {scene.scene_number}: {scene.title}
              </h3>

              <p>
                <strong>Duration:</strong>{" "}
                {scene.duration_seconds} seconds
              </p>

              <p>
                <strong>Narration:</strong>{" "}
                {scene.narration}
              </p>

              <p>
                <strong>Dialogue:</strong>{" "}
                {scene.dialogue || "None"}
              </p>

              <p>
                <strong>Camera:</strong>{" "}
                {scene.camera_motion}
              </p>

              <p>
                <strong>Image prompt:</strong>{" "}
                {scene.visual_prompt}
              </p>
            </article>
          ))}

          <button
            className="generate"
            onClick={() => {
              const blob = new Blob(
                [JSON.stringify(storyboard, null, 2)],
                { type: "application/json" }
              );
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "creator-studio-storyboard.json";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            ↓ Export Storyboard JSON
          </button>
        </section>
      )}

      <section className="features">
        <h2>Everything you need to create</h2>

        <div className="feature-grid">
          <article>
            <span>✦</span>
            <h3>AI Storyboard</h3>
            <p>Plan your video scene by scene.</p>
          </article>

          <article>
            <span>▧</span>
            <h3>Image Creation</h3>
            <p>Bring visual ideas to life.</p>
          </article>

          <article>
            <span>▶</span>
            <h3>Video Generation</h3>
            <p>Turn scenes into moving stories.</p>
          </article>

          <article>
            <span>♫</span>
            <h3>AI Audio</h3>
            <p>Add voice, dialogue and sound.</p>
          </article>
        </div>
      </section>

      <footer>
        CREATOR STUDIO © 2026 · BUILT FOR CREATORS
      </footer>
    </main>
  );
        }
