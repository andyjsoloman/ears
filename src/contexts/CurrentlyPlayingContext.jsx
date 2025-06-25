"use client";
import { createContext, useContext, useState } from "react";

const CurrentlyPlayingContext = createContext();

export function CurrentlyPlayingProvider({ children }) {
  const [currentRecordingId, setCurrentRecordingId] = useState(null);

  return (
    <CurrentlyPlayingContext.Provider
      value={{ currentRecordingId, setCurrentRecordingId }}
    >
      {children}
    </CurrentlyPlayingContext.Provider>
  );
}

export function useCurrentlyPlaying() {
  return useContext(CurrentlyPlayingContext);
}
