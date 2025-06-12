"use client";

import { useState } from "react";
import UploadFormWrapper from "@/components/UploadFormWrapper";
import UploadMap from "@/components/UploadMap";

export default function UploadPage() {
  const [selectedCoords, setSelectedCoords] = useState<null | {
    lat: number;
    lng: number;
  }>(null);
  const [showForm, setShowForm] = useState(false);

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setSelectedCoords(coords);
    setShowForm(true);
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <UploadMap value={selectedCoords} onChange={handleMapClick} />
      {showForm && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "white",
            padding: "1rem",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
          }}
        >
          <UploadFormWrapper location={selectedCoords} />
        </div>
      )}
    </div>
  );
}
