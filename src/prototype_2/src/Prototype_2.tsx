import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import geojsonData from './geojsonData'; // Import the generated GeoJSON file
import Draggable from 'react-draggable';
import './Prototype_2.css'; // Import your CSS

mapboxgl.accessToken =
  'pk.eyJ1IjoiZW5nZWJ1IiwiYSI6ImNtMmE2cnVxaDBmMWwycXF4cm44eDk1cWQifQ.xSqAPMjN2U4oJNrN3nIF2Q';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [legendPosition, setLegendPosition] = useState({ x: 20, y: 20 });
  const [visibleSizes, setVisibleSizes] = useState({
    veryLarge: true,
    large: true,
    medium: true,
    small: true,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [10.421906, 63.410827],
        zoom: 12,
      });

      map.current.on('load', () => {
        map.current?.addSource('circles', {
          type: 'geojson',
          data: geojsonData,
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

        map.current?.on('moveend', updateLegendVisibility);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const updateLegendVisibility = () => {
    if (!map.current) return;

    const features = map.current.queryRenderedFeatures({ layers: ['circle-layer'] });

    const sizes = { veryLarge: false, large: false, medium: false, small: false };

    features.forEach((feature) => {
      const radius = feature.properties?.radius;
      if (radius >= 40) sizes.veryLarge = true;
      else if (radius >= 30) sizes.large = true;
      else if (radius >= 20) sizes.medium = true;
      else if (radius < 20) sizes.small = true;
    });

    setVisibleSizes(sizes);
  };

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />

      <Draggable
        bounds="parent"
        nodeRef={legendRef}
        position={legendPosition}
        onDrag={(e, data) => setLegendPosition({ x: data.x, y: data.y })}
      >
        <div
          ref={legendRef}
          className={`legend ${isMobile ? 'mobile' : 'pc'}`}
        >

          <div className="legend-content">
            <ul className="legend-list">
              {visibleSizes.veryLarge && (
                <li>
                  <span className="legend-color" style={{ backgroundColor: '#6A0572' }}></span> Very Large
                </li>
              )}
              {visibleSizes.large && (
                <li>
                  <span className="legend-color" style={{ backgroundColor: '#9B5FB6' }}></span> Large
                </li>
              )}
              {visibleSizes.medium && (
                <li>
                  <span className="legend-color" style={{ backgroundColor: '#C18FCF' }}></span> Medium
                </li>
              )}
              {visibleSizes.small && (
                <li>
                  <span className="legend-color" style={{ backgroundColor: '#E0BBE4' }}></span> Small
                </li>
              )}
            </ul>
            <div className="zoom-buttons">
              <button onClick={handleZoomIn} className="zoom-button"><img src ="/src/assets/zoom-in.png" alt = "Zoom In"  className='zoom-icon' />
              </button>
              <button onClick={handleZoomOut} className="zoom-button"><img src ="/src/assets/zoom-out.png" alt = "Zoom Out"  className='zoom-icon' />
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default Map;