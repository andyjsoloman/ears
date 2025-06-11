"use client";

import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";

type Props = {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
};

export default function MapPicker({ value, onChange }: Props) {
  const [viewport] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
    zoom: 10,
  });

  return (
    <div style={{ height: "300px", marginBottom: "1rem" }}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
        onClick={(e) => onChange({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
      >
        {value && <Marker latitude={value.lat} longitude={value.lng} />}
      </Map>
    </div>
  );
}
