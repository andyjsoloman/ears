"use client";

import "./browse-globals.css";

import { Canvas } from "@react-three/fiber";
import Experience from "@/components/browse/Experience";
import AudioPlayer from "@/components/browse/AudioPlayer";

export default function BrowsePage() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas>
        <Experience />
      </Canvas>
      <AudioPlayer />
    </div>
  );
}
