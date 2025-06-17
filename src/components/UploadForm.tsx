"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import mapBoundary from "../constants/mapBoundary";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";

type Props = {
  location: { lat: number; lng: number } | null;
};

export default function UploadForm({ location }: Props) {
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isWithinIsland = (lat: number, lng: number) => {
    const pt = point([lng, lat]);
    const poly = polygon(mapBoundary.features[0].geometry.coordinates);
    return booleanPointInPolygon(pt, poly);
  };

  const handleUpload = async () => {
    if (!file || !location) return alert("Missing file or location");

    if (!isWithinIsland(location.lat, location.lng)) {
      return alert("Upload location must be within the designated area.");
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `recordings/${Date.now()}.${fileExt}`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: storageData, error: storageError } = await supabase.storage
      .from("recordings")
      .upload(filePath, file);

    if (storageError) {
      alert("Upload failed");
      console.error(storageError);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("recordings")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("recordings").insert({
      title: title || "Untitled",
      uploader_name: uploader || null,
      lat: location.lat,
      lng: location.lng,
      file_url: publicUrlData.publicUrl,
    });

    if (dbError) {
      alert("Database insert failed");
      console.error(dbError);
    } else {
      setSuccess(true);
    }

    setUploading(false);
  };

  return (
    <form
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <label>
        Title (optional)
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Uploader Name (optional)
        <input
          type="text"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
        />
      </label>
      <label>
        Recording File
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <button type="button" disabled>
        Location: {location ? "✅ Set" : "❌ Not Set"}
      </button>
      <button type="button" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {success && <p>✅ Upload complete!</p>}
    </form>
  );
}
