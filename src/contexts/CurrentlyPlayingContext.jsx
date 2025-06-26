"use client";
import { createContext, useContext, useState } from "react";

const CurrentlyPlayingContext = createContext();

export function CurrentlyPlayingProvider({ children }) {
  const [currentRecording, setCurrentRecording] = useState(null);

  return (
    <CurrentlyPlayingContext.Provider
      value={{ currentRecording, setCurrentRecording }}
    >
      {children}
    </CurrentlyPlayingContext.Provider>
  );
}

export function useCurrentlyPlaying() {
  return useContext(CurrentlyPlayingContext);
}
