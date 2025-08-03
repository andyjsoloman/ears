"use client";

import Map, { Marker, MapRef, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { windsorBold } from "@/styles/fonts";
import { windsorRegular } from "@/styles/fonts";

import { useRef, useState } from "react";
import mapBoundary from "@/constants/mapBoundary";
import styled from "styled-components";

import Button from "./Button";
import Modal from "./Modal";

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Heading = styled.h1.attrs(() => ({
  className: windsorBold.className,
}))`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const BodyText = styled.p.attrs(() => ({
  className: windsorRegular.className,
}))`
  font-size: 1rem;
`;
const EmailText = styled.p.attrs(() => ({
  className: windsorRegular.className,
}))`
  font-size: 1rem;
  color: #0070f3;
  margin: 1rem 0;
`;

const PageIndicatorRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const PageButtons = styled.div`
  display: flex;

  gap: 5rem;
  margin-top: 1rem;
`;

const PageIndicatorDot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? "#333" : "#ccc")};
  transition: background-color 0.3s;
`;

type Props = {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
};

export default function MapPicker({ value, onChange }: Props) {
  const mapRef = useRef<MapRef | null>(null);

  const [viewport, setViewport] = useState({
    latitude: value?.lat ?? 48.92547072322581,
    longitude: value?.lng ?? -123.45522390529911,
    zoom: 10,
  });
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const infoPages = [
    {
      heading: "Eco Acoustic Relativity Station (E.A.R.S.)",
      body: "E.A.R.S. is an interactive sound map that invites participants to deepen their perceptual relativity to the sonic landscapes of Galiano Island and Active Passive Festival.",
    },
    {
      heading: "",
      body: "E.A.R.S. seeks to explore how deeply listening to the soundscape of a place can influence our perception of time, space, and sense of belonging by sharing personal and collective sonic experiences over the duration of the festival",
    },
    {
      heading: "How to Contribute",
      body: "Select a point on the map to mark the location of your recording, and upload using the form that appears. ",
    },
    {
      heading: "Record Respectfully",
      body: "When contributing to E.A.R.S., please ensure that your recordings are respectful of the environment and the community. Avoid capturing private conversations or sensitive locations without permission.",
    },
    {
      heading: "",
      body: "Inherent within EARS’s encouragement of sonic reciprocity is the awareness and recognition that practices and philosophies such as Deep Listening and Acoustic Ecology are in many ways colonial settler interpretations of Indigenous ways of relating with the world. As such E.A.R.S. would like to acknowledge with the utmost respect the fundamental ways that traditional indigenous knowledge systems have been and continue to be appropriated, exploited and oppressed.",
    },
    {
      heading: "",
      body: "We seek to (and encourage other settler participants to) be gracious, humble and respectful guests on the shared, stolen, unceded, ancestral and traditional territories of Penelakut, Lamalcha, Hwitslum and other Hul’qumi’num and SENĆOŦEN speaking peoples, as well as the ceded territories of Tsawwassen First Nation, on what is now known as Galiano Island",
    },
  ];

  const [infoPageIndex, setInfoPageIndex] = useState(0);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setViewport({
          latitude: lat,
          longitude: lng,
          zoom: 14,
        });

        mapRef.current?.flyTo({ center: [lng, lat], zoom: 14, duration: 1000 });
      },
      (err) => {
        alert("Failed to get location");
        console.error(err);
      }
    );
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Modal
        isOpen={showInitialModal}
        onClose={() => setShowInitialModal(false)}
        usePortal
      >
        <Heading>Welcome to E.A.R.S.</Heading>
        <BodyText>
          Pick a point on the map to select the loaction of your recording, or
          tap the info button (top left) to find out more
        </BodyText>
        <Button onClick={() => setShowInitialModal(false)}>Close</Button>
      </Modal>
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        usePortal
      >
        <Heading>Feedback</Heading>
        <BodyText>
          We&apos;d love to hear your thoughts on this project. Contact us
          though the email address below:
        </BodyText>

        <EmailText>
          <a href="mailto:ears.activepassive@gmail.com">
            ears.activepassive@gmail.com
          </a>
        </EmailText>
        <Button onClick={() => setShowFeedbackModal(false)}>Close</Button>
      </Modal>
      <Modal
        isOpen={showInfoModal}
        onClose={() => {
          setShowInfoModal(false);
          setInfoPageIndex(0); // Reset on close
        }}
        usePortal
      >
        <Heading>{infoPages[infoPageIndex].heading}</Heading>
        <BodyText>{infoPages[infoPageIndex].body}</BodyText>

        <PageIndicatorRow>
          {infoPages.map((_, index) => (
            <PageIndicatorDot key={index} active={index === infoPageIndex} />
          ))}
        </PageIndicatorRow>

        <PageButtons>
          <Button
            onClick={() => setInfoPageIndex((i) => Math.max(i - 1, 0))}
            disabled={infoPageIndex === 0}
          >
            <Icon src="/arrow-circle-left-white.svg" alt="Previous" />
          </Button>
          <Button
            onClick={() =>
              setInfoPageIndex((i) => Math.min(i + 1, infoPages.length - 1))
            }
            disabled={infoPageIndex === infoPages.length - 1}
          >
            <Icon src="/arrow-circle-right-white.svg" alt="Next" />
          </Button>
        </PageButtons>

        <Button
          onClick={() => {
            setShowInfoModal(false);
            setInfoPageIndex(0);
          }}
          style={{ marginTop: "1rem" }}
        >
          Close
        </Button>
      </Modal>

      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={viewport}
        onMoveEnd={(e) => setViewport(e.viewState)} // only update when movement ends
        onClick={(e) => onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        style={{ width: "100%", height: "100%" }}
      >
        {value && <Marker latitude={value.lat} longitude={value.lng} />}
        {mapBoundary && (
          <Source id="boundary" type="geojson" data={mapBoundary}>
            <Layer
              id="boundary-layer"
              type="fill"
              paint={{
                "fill-color": "#088",
                "fill-opacity": 0.2,
              }}
            />
          </Source>
        )}
      </Map>

      <Button
        onClick={handleGetLocation}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          // padding: "0.5rem 1rem",
          // background: "#000",
          // color: "#fff",
          // border: "none",
          // borderRadius: "6px",
        }}
      >
        Get Location
      </Button>

      <Button
        onClick={() => setShowInfoModal(true)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
        }}
      >
        <Icon src="/infowhite.svg" alt="Play icon" />
      </Button>
      <Button
        onClick={() => setShowFeedbackModal(true)}
        style={{
          position: "absolute",
          top: 10,
          left: 80,
          zIndex: 10,
        }}
      >
        <Icon src="/chat-white.svg" alt="Feedback icon" />
      </Button>
    </div>
  );
}
