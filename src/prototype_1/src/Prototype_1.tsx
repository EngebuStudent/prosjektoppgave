import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import geojsonData from './geojsonData'; // Import the generated GeoJSON file
import Draggable from 'react-draggable';
import './Prototype_1.css'; // Import your CSS

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5nZWJ1IiwiYSI6ImNtMmE2cnVxaDBmMWwycXF4cm44eDk1cWQifQ.xSqAPMjN2U4oJNrN3nIF2Q'; // Replace with your Mapbox token

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // State to control legend visibility and its position
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [legendPosition, setLegendPosition] = useState({ x: 20, y: 20 }); // Top-right default position

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [10.421906, 63.410827], // Center on Trondheim
        zoom: 12,
      });

      map.current.on('load', () => {
        map.current?.addSource('circles', {
          type: 'geojson',
          data: geojsonData, // Use the generated GeoJSON data directly
        });

        map.current?.addLayer({
          id: 'circle-layer',
          type: 'circle',
          source: 'circles',
          paint: {
            'circle-radius': ['get', 'radius'],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.8,
          },
        });
      });

      // Add a click event listener to toggle the legend visibility
      map.current.on('click', () => {
        setIsLegendVisible((prev) => !prev);
      });
    }

    // Cleanup function to remove map on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrag = (e: any, data: any) => {
    setLegendPosition({ x: data.x, y: data.y });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Map container */}
      <div ref={mapContainer} className="map-container" />

      {/* Legend */}
      {isLegendVisible && (
        <Draggable
          bounds="parent" // Prevent dragging beyond the parent container
          position={legendPosition}
          onDrag={handleDrag}
        >
          <div className="legend" style={{ top: 20, right: 20, position: 'absolute' }}>

            <ul>
              <li>
                <span className="legend-color" style={{ backgroundColor: '#6A0572' }}></span>
                Very Large
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: '#9B5FB6' }}></span>
                Large
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: '#C18FCF' }}></span>
                Medium
              </li>
              <li>
                <span className="legend-color" style={{ backgroundColor: '#E0BBE4' }}></span>
                Small
              </li>
            </ul>

            <div className="zoom-buttons">
              <button onClick={handleZoomIn} className="zoom-button"><img src ="/src/assets/zoom-in.png" alt = "Zoom In"  className='zoom-icon' />
              </button>
              <button onClick={handleZoomOut} className="zoom-button"><img src ="/src/assets/zoom-out.png" alt = "Zoom Out"  className='zoom-icon' />
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Map;