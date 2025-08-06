"use client";

import { useEffect, useState, useRef } from "react";
import { useCurrentlyPlaying } from "../../contexts/CurrentlyPlayingContext";

import styled from "styled-components";
import PlayButton from "./PlayButton";
import VolumeControl from "./VolumeControl";
import Button from "../Button";
import { useRecordings } from "../../recordings/useRecordings";
import { formatAudioTime } from "../../utils/useDateTime";
import { QUERIES } from "../../constants/queries";
import { windsorRegular } from "@/styles/fonts";
import { windsorBold } from "@/styles/fonts";
import { color } from "framer-motion";

const AudioContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: white;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  width: 800px;

  padding: 12px 20px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  @media ${QUERIES.tablet} {
    position: absolute;
    width: 100%;
    z-index: 1000;
    bottom: 0;
    margin: 0;
    border-radius: 0;
    background: white;
    /* justify-content: center; */
    gap: 1.5rem;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media ${QUERIES.tablet} {
    flex-grow: 1;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ProgressBar = styled.input.attrs({ type: "range" })`
  //remove baseline styles
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;

  /***** Track Styles *****/
  /***** Chrome, Safari, Opera, and Edge Chromium *****/
  &::-webkit-slider-runnable-track {
    background: var(--color-black);
    height: 6px;
    border-radius: 3px;
  }

  /******** Firefox ********/
  &&::-moz-range-track {
    background: var(--color-black);
    height: 6px;
    border-radius: 3px;
  }

  &&::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -9px; /* Centers thumb on the track */
    background-color: var(--color-primary);
    height: 24px;
    width: 12px;
    border-radius: 4px;
  }

  &&::-moz-range-thumb {
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0; /*Removes default border-radius that FF applies*/
    background-color: var(--color-primary);
    height: 24px;
    width: 12px;
    border-radius: 4px;
  }

  width: 500px;
  margin-top: 20px;
  margin-bottom: 24px;
  @media ${QUERIES.tablet} {
    width: 100%;
  }
`;

const DurationContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const VolumeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3.attrs(() => ({
  className: windsorBold.className,
}))`
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
  margin-top: 12px;
`;

const Name = styled.h4.attrs(() => ({
  className: windsorBold.className,
}))`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  margin-top: 4px;
`;

const Description = styled.p.attrs(() => ({
  className: windsorRegular.className,
}))`
  font-size: 0.9rem;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  const { currentRecording, setCurrentRecording } = useCurrentlyPlaying();

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsPlaying(true);
      audio.play();
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentRecording]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (e.target.value / 100) * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isMuted ? (audio.volume = 1) : (audio.volume = 0);
    setVolume(audio.volume);
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return; // Ensure audio element exists
    audio.volume = e.target.value / 100;
    setVolume(audio.volume);
    if (audio.volume > 0) {
      setIsMuted(false);
    }
  };

  const handleEnd = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleClose = () => {
    setCurrentRecording(null);
  };

  if (!currentRecording) return null;

  if (playbackError) {
    return (
      <AudioContainer>
        <p>{playbackError}</p>
      </AudioContainer>
    );
  }

  return (
    <AudioContainer className="audio-player">
      <PlayButton togglePlayPause={togglePlayPause} isPlaying={isPlaying} />
      <InfoContainer>
        <Title>{currentRecording.title}</Title>
        <Name>{currentRecording.uploader_name}</Name>
        <Description>{currentRecording.description}</Description>

        <DurationContainer>
          <span>{formatAudioTime(currentTime)}</span>
          <span>{formatAudioTime(duration)}</span>
        </DurationContainer>
        <ProgressContainer>
          <ProgressBar
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleProgressChange}
            disabled={!duration}
          />
        </ProgressContainer>
      </InfoContainer>
      <VolumeContainer>
        <VolumeControl
          handleVolumeChange={handleVolumeChange}
          volume={volume}
          handleMute={handleMute}
        />
      </VolumeContainer>
      <audio
        autoPlay
        ref={audioRef}
        src={currentRecording.file_url}
        onEnded={handleEnd}
        onError={() => {
          setPlaybackError("Unable to load or play this audio file.");
          setIsPlaying(false);
        }}
      />
      <Button
        onClick={handleClose}
        style={{
          position: "relative",
          right: "40px",
          background: "transparent",
          color: "black",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <Icon src="/x-circle-p-blue.svg" alt="Close Form" />
      </Button>
    </AudioContainer>
  );
}

export default AudioPlayer;
