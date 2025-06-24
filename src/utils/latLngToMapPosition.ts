import browseLimits from "@/utils/browseLimits";

const { minLat, maxLat, minLng, maxLng } = browseLimits;

// Projection dimensions
// const averageLat = (minLat + maxLat) / 2;
const latRange = maxLat - minLat;
const lngRangeAdjusted =
  (maxLng - minLng) *
  ((Math.cos(minLat * Math.PI / 180) + Math.cos(maxLat * Math.PI / 180)) / 2);

const MAP_WIDTH = 1160;
const MAP_HEIGHT = (MAP_WIDTH / (lngRangeAdjusted / latRange)) * 0.965;

// Positioning offsets
const MAP_OFFSET_X = -188; //West(negative / East(positive) offset
const MAP_OFFSET_Z = 265; //North(negative) / South(positive) offset

// Fine-tune Y rotation (in degrees)
const ROTATION_Y_DEGREES = 95; // Use 90 for default, adjust +/- for fine tuning
const ROTATION_Y_RADIANS = (ROTATION_Y_DEGREES * Math.PI) / 180;

// Mercator-based lat normalization
function latToNormalizedMercator(lat: number) {
  const mercator = (val: number) =>
    Math.log(Math.tan(Math.PI / 4 + (val * Math.PI) / 360));

  const min = mercator(minLat);
  const max = mercator(maxLat);
  const current = mercator(lat);

  return 1 - (current - min) / (max - min);
}

export function latLngToMapPosition(lat: number, lng: number) {
  const lngAdjusted = (lng - minLng) * Math.cos((lat * Math.PI) / 180);
  const xNorm = lngAdjusted / lngRangeAdjusted;
  const zNorm = latToNormalizedMercator(lat);

  const x = xNorm * MAP_WIDTH - MAP_WIDTH / 2 + MAP_OFFSET_X;
  const z = zNorm * MAP_HEIGHT - MAP_HEIGHT / 2 + MAP_OFFSET_Z;
  const y = 14.7;

  // Apply adjustable Y rotation
  const cos = Math.cos(ROTATION_Y_RADIANS);
  const sin = Math.sin(ROTATION_Y_RADIANS);
  const xRot = x * cos + z * sin;
  const zRot = -x * sin + z * cos;

  return [xRot, y, zRot];
}




// Draw out a polygon of circumference of the island. Use the array to run through this function and create markers