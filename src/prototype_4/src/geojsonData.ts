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

// Predefined circle sizes, colors, and descriptive names
const sizesAndColors = [
  { size: 10, color: '#E0BBE4', name: 'Small Object' },       // Small: ~500m diameter
  { size: 20, color: '#C18FCF', name: 'Medium Object' },     // Medium: ~1km diameter
  { size: 30, color: '#9B5FB6', name: 'Large Object' },      // Large: ~1.5km diameter
  { size: 50, color: '#6A0572', name: 'Very Large Object' }, // Very Large: ~2km diameter
];

// Function to generate random circles (points) around Trondheim
const generateRandomCircles = (numPoints: number): Feature<Point>[] => {
  const features: Feature<Point>[] = [];
  
  for (let i = 0; i < numPoints; i++) {
    const longitude = randomCoordinate(bounds.minLng, bounds.maxLng);
    const latitude = randomCoordinate(bounds.minLat, bounds.maxLat);
    
    // Randomly pick a size, color, and name from the predefined set
    const { size, color, name } = sizesAndColors[Math.floor(Math.random() * sizesAndColors.length)];

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude], // Random coordinates within the bounding box
      },
      properties: {
        radius: size,  // Circle size
        color: color,  // Circle color
        name: name,    // Descriptive name for the circle
      },
    });
  }

  return features;
};

const geojsonData: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: generateRandomCircles(20), // Generate 20 random circles
};

export default geojsonData;

// Save the GeoJSON data to a file (optional)
console.log(JSON.stringify(geojsonData, null, 2)); // Log the data to the console