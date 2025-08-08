"use client";

import "./browse-globals.css";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "@/components/browse/Experience";
import AudioPlayer from "@/components/browse/AudioPlayer";
import Button from "@/components/Button";

export default function BrowsePage() {
  const [experienceKey, setExperienceKey] = useState(0);
  const handleResetView = () => {
    setExperienceKey((prev) => prev + 1); // Changing key will remount <Experience />
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Button
        onClick={handleResetView}
        style={{
          position: "absolute",
          bottom: "3rem",
          right: "1.5rem",
          zIndex: 10,
          padding: "0.5rem 1rem",

          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Reset View
      </Button>
      <Canvas>
        <Experience key={experienceKey} />
      </Canvas>
      <AudioPlayer />
    </div>
  );
}
