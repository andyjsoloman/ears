"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import mapBoundary from "../constants/mapBoundary";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import styled from "styled-components";
import { windsorRegular } from "@/styles/fonts";
import { windsorBold } from "@/styles/fonts";
import Button from "./Button";

const Form = styled.form`
  max-width: 480px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 1000;
`;

const Label = styled.label.attrs(() => ({
  className: windsorRegular.className,
}))`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 1rem;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: 2px solid var(--color-primary, #0077ff);
    border-color: transparent;
  }
`;

const UploadButton = styled(Button).attrs(() => ({
  className: windsorBold.className,
}))`
  justify-content: center;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.2s;

  &:hover {
    background: #005ecc;
  }
`;

const Message = styled.p`
  font-size: 0.95rem;
  color: green;
  margin-top: -0.5rem;
`;

type Props = {
  location: { lat: number; lng: number } | null;
};

export default function UploadForm({ location }: Props) {
  const [title, setTitle] = useState("");
  const [uploader, setUploader] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

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

    const start = performance.now();
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
      description: description || null,
    });

    const end = performance.now(); // End timing
    const duration = ((end - start) / 1000).toFixed(2);
    console.log(`✅ Upload and DB insert completed in ${duration} seconds`);

    if (dbError) {
      alert("Database insert failed");
      console.error(dbError);
    } else {
      setSuccess(true);
    }

    setUploading(false);
  };

  return (
    <Form
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        zIndex: 1000,
      }}
    >
      <Label>
        Title (optional)
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Label>
      <Label>
        Uploader Name (optional)
        <Input
          type="text"
          value={uploader}
          onChange={(e) => setUploader(e.target.value)}
        />
      </Label>
      <Label>
        Description (optional - context, time of day etc.)
        <Input
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/);
            if (words.length <= 40) setDescription(e.target.value);
          }}
        />
        <small>
          {description.trim().split(/\s+/).filter(Boolean).length}/40 words
        </small>
      </Label>

      <Label>
        Recording File
        <Input
          type="file"
          accept="audio/*, audio/mp4, .m4a"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </Label>
      <UploadButton disabled onClick={() => {}}>
        Location: {location ? "✅ Set" : "❌ Not Set"}
      </UploadButton>
      <UploadButton type="button" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </UploadButton>
      {success && <Message>✅ Upload complete!</Message>}
    </Form>
  );
}
