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
`;

const BodyText = styled.p.attrs(() => ({
  className: windsorRegular.className,
}))`
  font-size: 1rem;
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
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        usePortal
      >
        <Heading>More Information</Heading>
        <BodyText>
          This project maps geolocated field recordings onto a 3D surface.
        </BodyText>
        <Button onClick={() => setShowInfoModal(false)}>Close</Button>
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
    </div>
  );
}
