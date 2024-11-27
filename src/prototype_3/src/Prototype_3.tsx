import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { treeLayerData, buildingLayerData, carLayerData } from './geojsonData'; // Import your GeoJSON data
import './Prototype_3.css'; // Import your CSS

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5nZWJ1IiwiYSI6ImNtMmE2cnVxaDBmMWwycXF4cm44eDk1cWQifQ.xSqAPMjN2U4oJNrN3nIF2Q'; // Replace with your valid Mapbox token

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // State to track which icons are revealed in the legend
  const [legendItems, setLegendItems] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // State to keep track of map position and zoom
  const [mapState, setMapState] = useState<{
    center: [number, number];
    zoom: number;
  }>({
    center: [10.421906, 63.410827], // Initial center on Trondheim
    zoom: 12,
  });

  // Check for mobile view on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to reveal icon in the legend
  const addToLegend = useCallback((iconType: string) => {
    if (!legendItems.includes(iconType)) {
      setLegendItems((prevItems) => [...prevItems, iconType]);
    }
  }, [legendItems]);

  // Function to remove icon from the legend
  const removeFromLegend = (iconType: string) => {
    setLegendItems((prevItems) => prevItems.filter(item => item !== iconType));
  };

  // Load custom images for icons
  const loadImage = (url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v11', // Map style
        center: mapState.center, // Center on Trondheim
        zoom: mapState.zoom,
      });

      map.current.on('load', async () => {
        try {
          console.log('Map loaded');

           // Load custom icons
           const treeIcon = await loadImage('/src/assets/icons/tree.png');
           const buildingIcon = await loadImage('/src/assets/icons/buildings.png');
           const carIcon = await loadImage('/src/assets/icons/car.png');

          console.log('Images loaded successfully:', { treeIcon, buildingIcon, carIcon });

          // Add images to the map
          map.current?.addImage('tree-icon', treeIcon, { sdf: false });
          map.current?.addImage('building-icon', buildingIcon, { sdf: false });
          map.current?.addImage('car-icon', carIcon, { sdf: false });

          // Add tree layer
          map.current?.addSource('tree-source', {
            type: 'geojson',
            data: treeLayerData,
          });
          map.current?.addLayer({
            id: 'tree-layer',
            type: 'symbol',
            source: 'tree-source',
            layout: {
              'icon-image': 'tree-icon',
              'icon-size': 0.05, // Static size for icons
            },
          });

          // Add building layer
          map.current?.addSource('building-source', {
            type: 'geojson',
            data: buildingLayerData,
          });
          map.current?.addLayer({
            id: 'building-layer',
            type: 'symbol',
            source: 'building-source',
            layout: {
              'icon-image': 'building-icon',
              'icon-size': 0.05, // Static size for icons
            },
          });

          // Add car layer
          map.current?.addSource('car-source', {
            type: 'geojson',
            data: carLayerData,
          });
          map.current?.addLayer({
            id: 'car-layer',
            type: 'symbol',
            source: 'car-source',
            layout: {
              'icon-image': 'car-icon',
              'icon-size': 0.05, // Static size for icons
            },
          });

          // Add click event to reveal icon in the legend when clicked
          map.current?.on('click', 'tree-layer', () => addToLegend('Tree'));
          map.current?.on('click', 'building-layer', () => addToLegend('Building'));
          map.current?.on('click', 'car-layer', () => addToLegend('Car'));

          console.log('GeoJSON layers added');
        } catch (error) {
          console.error('Error loading images or layers:', error);
        }
      });

      // Update map state on move end
      map.current.on('moveend', () => {
        setMapState({
          center: map.current!.getCenter().toArray() as [number, number],
          zoom: map.current!.getZoom(),
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [addToLegend]); // addToLegend is stable now because it's memoized with useCallback

  // Function to handle zoom in
  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };


  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Map container */}
      <div ref={mapContainer} className="map-container" />
      
      {/* Always show the legend */}
      <div className={`legend ${isMobile ? 'mobile' : 'pc'}`}>
        
        <ul>
          {legendItems.includes('Tree') && (
            <li>
              <img src= "/src/assets/icons/tree.png" alt="Tree icon" className="legend-icon" />
              <span className="legend-text">Tree - Natural Habitat</span>
              <button className="remove-button" onClick={() => removeFromLegend('Tree')}>X</button>
            </li>
          )}
          {legendItems.includes('Building') && (
            <li>
              <img src="/src/assets/icons/buildings.png" alt="Building icon" className="legend-icon" />
              <span className="legend-text">Building - Urban Structure</span>
              <button className="remove-button" onClick={() => removeFromLegend('Building')}>X</button>
            </li>
          )}
          {legendItems.includes('Car') && (
            <li>
              <img src="/src/assets/icons/car.png" alt="Car icon" className="legend-icon" />
              <span className="legend-text">Car - Transportation</span>
              <button className="remove-button" onClick={() => removeFromLegend('Car')}>X</button>
            </li>
          )}
        </ul>

        {/* Zoom Buttons */}
        <div className="zoom-buttons">
        <button onClick={handleZoomIn} className="zoom-button"><img src ="/src/assets/icons/zoom-in.png" alt = "Zoom In"  className='zoom-icon' />
        </button>
              <button onClick={handleZoomOut} className="zoom-button"><img src ="/src/assets/icons/zoom-out.png" alt = "Zoom Out"  className='zoom-icon' />
              </button>
              
            </div>
      </div>
    </div>
  );
};

export default Map;