"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [tab, setTab] = useState("Text to Video");
  const [generated, setGenerated] = useState(false);

  return (
    <main className="main">
      <nav className="navbar">
        <div className="logo">✦ Creator<span>Studio</span></div>
        <button className="profile">M</button>
      </nav>

      <section className="hero">
        <div className="tag">✦ YOUR AI CREATIVE WORKSPACE</div>
        <h1>Turn your ideas into<br /><span>extraordinary videos.</span></h1>
        <p>Create stories, generate scenes and bring your imagination to life.</p>
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
              className={tab === item ? "active" : ""}
              onClick={() => { setTab(item); setGenerated(false); }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="prompt-box">
          <label>YOUR CREATIVE IDEA</label>
          <textarea
            value={idea}
            onChange={e => { setIdea(e.target.value); setGenerated(false); }}
            placeholder="Describe the video you imagine... A cinematic jungle adventure, a futuristic city, a magical story..."
          />
          <div className="prompt-footer">
            <span>{idea.length} characters</span>
            <span>✦ AI PROMPT</span>
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
          onClick={() => setGenerated(true)}
        >
          ✦ Generate Storyboard
        </button>

        {generated && (
          <div className="result">
            <h3>✦ Your storyboard workspace</h3>
            {idea.trim() ? (
              <>
                <p>{idea}</p>
                <p className="note">Your idea is ready for the next stage. AI scene generation will be connected in a later development phase.</p>
              </>
            ) : (
              <p>Please enter your video idea first.</p>
            )}
          </div>
        )}
      </section>

      <section className="features">
        <h2>Everything you need to create</h2>
        <div className="feature-grid">
          <article><span>✦</span><h3>AI Storyboard</h3><p>Plan your video scene by scene.</p></article>
          <article><span>▧</span><h3>Image Creation</h3><p>Bring visual ideas to life.</p></article>
          <article><span>▶</span><h3>Video Generation</h3><p>Turn scenes into moving stories.</p></article>
          <article><span>♫</span><h3>AI Audio</h3><p>Add voice, dialogue and sound.</p></article>
        </div>
      </section>

      <footer>CREATOR STUDIO © 2026 · BUILT FOR CREATORS</footer>
    </main>
  );
              }
