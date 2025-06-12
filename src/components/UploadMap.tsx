"use client";

import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { useRef, useState } from "react";

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
      </Map>

      <button
        onClick={handleGetLocation}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          padding: "0.5rem 1rem",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Get Location
      </button>
    </div>
  );
}
