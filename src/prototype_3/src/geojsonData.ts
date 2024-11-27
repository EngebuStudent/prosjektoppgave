// Helper function to generate random coordinates within bounds
const randomCoordinate = (min: number, max: number) => Math.random() * (max - min) + min;

// Bounding box around an area south of Trondheim
const bounds = {
  minLng: 10.35, // Minimum longitude
  maxLng: 10.50, // Maximum longitude
  minLat: 63.40, // Minimum latitude
  maxLat: 63.42, // Maximum latitude
};

// Function to generate random points for GeoJSON format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateRandomPoints = (numPoints: number, type: string, icon: string): any => {
  const features = [];
  
  for (let i = 0; i < numPoints; i++) {
    const longitude = randomCoordinate(bounds.minLng, bounds.maxLng);
    const latitude = randomCoordinate(bounds.minLat, bounds.maxLat);

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      properties: {
        name: type,    // Name of the feature (Tree, Building, Car)
        icon: icon,    // Icon reference (e.g., 'tree-icon', 'building-icon', 'car-icon')
      },
    });
  }

  return {
    type: 'FeatureCollection',
    features,
  };
};

// Generate 20 random points for trees, buildings, and cars
export const treeLayerData = generateRandomPoints(20, 'Tree', 'tree-icon');
export const buildingLayerData = generateRandomPoints(20, 'Building', 'building-icon');
export const carLayerData = generateRandomPoints(20, 'Car', 'car-icon');