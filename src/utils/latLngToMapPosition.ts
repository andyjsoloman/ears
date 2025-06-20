import browseLimits from "@/utils/browseLimits";

const { minLat, maxLat, minLng, maxLng } = browseLimits;
const averageLat = (minLat + maxLat) / 2;
const latRange = maxLat - minLat;
const lngRange = (maxLng - minLng) * Math.cos((averageLat * Math.PI) / 180);
const aspectRatio = lngRange / latRange;

const MAP_WIDTH = 810;
const MAP_HEIGHT = (MAP_WIDTH / aspectRatio) * 1.28


// Offsets to fine-tune positioning 
const MAP_OFFSET_X = -375; // West (negative) / East (positive)
const MAP_OFFSET_Z = 270;  // North (negative)/South (positive)

export function latLngToMapPosition(lat: number, lng: number) {
  // Normalize coordinates
  const xNorm = (lng - minLng) / lngRange;
  const zNorm = 1 - (lat - minLat) / latRange;

  // Convert to 3D position
  const x = xNorm * MAP_WIDTH - MAP_WIDTH / 2 + MAP_OFFSET_X;
  const z = zNorm * MAP_HEIGHT - MAP_HEIGHT / 2 + MAP_OFFSET_Z;
  const y = 14.7;

  // Rotate 90 degrees clockwise around Y axis
  const theta = Math.PI / 2;
  const xRot = x * Math.cos(theta) + z * Math.sin(theta);
  const zRot = -x * Math.sin(theta) + z * Math.cos(theta);

  return [xRot, y, zRot];
}



