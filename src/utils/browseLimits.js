import mapBoundary from "@/constants/mapBoundary";

const coordinates = mapBoundary.features[0].geometry.coordinates[0];

// Extract all lats and lngs
const lats = coordinates.map((coord) => coord[1]);
const lngs = coordinates.map((coord) => coord[0]);

const browseLimits = {
  minLat: Math.min(...lats),
  maxLat: Math.max(...lats),
  minLng: Math.min(...lngs),
  maxLng: Math.max(...lngs),
};

export default browseLimits;
