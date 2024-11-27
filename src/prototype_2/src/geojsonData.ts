
import { FeatureCollection, Point, Feature } from 'geojson';

// Function to generate random longitude and latitude within a bounding box
const randomCoordinate = (min: number, max: number) => Math.random() * (max - min) + min;

// Bounding box around Trondheim [minLng, minLat, maxLng, maxLat]
const bounds = {
  minLng: 10.35, // Minimum longitude around Trondheim
  maxLng: 10.50, // Maximum longitude around Trondheim
  minLat: 63.40, // Minimum latitude around Trondheim
  maxLat: 63.45, // Maximum latitude around Trondheim
};

// Predefined circle sizes and their associated colors
const sizesAndColors = [
  { size: 10, color: '#E0BBE4' }, // Light Purple for Small circles
  { size: 20, color: '#C18FCF' }, // Soft Purple for Medium circles
  { size: 30, color: '#9B5FB6' }, // Medium Purple for Large circles
  { size: 40, color: '#6A0572' }, // Dark Purple for Very Large circles
];

// Function to generate random circles (points) around Trondheim
const generateRandomCircles = (numPoints: number): Feature<Point>[] => {
  const features: Feature<Point>[] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const longitude = randomCoordinate(bounds.minLng, bounds.maxLng);
    const latitude = randomCoordinate(bounds.minLat, bounds.maxLat);
    
    // Randomly pick a size and color from the predefined set
    const { size, color } = sizesAndColors[Math.floor(Math.random() * sizesAndColors.length)];

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude], // Random coordinates within the bounding box
      },
      properties: {
        radius: size,  // Circle size
        color: color,  // Circle color
      },
    });
  }

  return features;
};

const geojsonData: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: generateRandomCircles(20), // Generate 10 random circles
};

export default geojsonData; // Default export

// Save the GeoJSON data to a file (optional)
console.log(JSON.stringify(geojsonData, null, 2));
// Log the data to the console (optional)
