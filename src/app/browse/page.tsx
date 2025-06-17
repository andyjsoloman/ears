"use client";

import "./browse-globals.css";

import { Canvas } from "@react-three/fiber";

import Experience from "@/components/browse/Experience";

export default function BrowsePage() {
  return (
    <Canvas>
      <Experience />
    </Canvas>
  );
}
