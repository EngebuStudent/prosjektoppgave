import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import geojsonData from './geojsonData';
import './Prototype_4.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5nZWJ1IiwiYSI6ImNtMmE2cnVxaDBmMWwycXF4cm44eDk1cWQifQ.xSqAPMjN2U4oJNrN3nIF2Q';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [10.421906, 63.410827],
        zoom: 12,
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully.');

        map.current?.addSource('circles', {
          type: 'geojson',
          data: geojsonData,
        });

        // Add the circle layer with fixed geographic sizes
        map.current?.addLayer({
          id: 'circle-layer',
          type: 'circle',
          source: 'circles',
          paint: {
            // Define the radius in meters
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              0, ['get', 'radius'], // At zoom level 0, use the radius from GeoJSON
              20, ['get', 'radius'], // At zoom level 20, use the same radius
            ],
            'circle-color': ['get', 'color'], // Use color from GeoJSON properties
            'circle-opacity': 0.8, // Set opacity for better visualization
            'circle-pitch-scale': 'map', // Makes the size consistent in meters
          },
        });

        // Add a symbol layer for text labels
        map.current?.addLayer({
          id: 'label-layer',
          type: 'symbol',
          source: 'circles',
          layout: {
            'text-field': ['get', 'name'], // Show name property as text
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-anchor': 'top',
            'text-offset': [0, 1.5],
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1,
          },
        });

        // Handle text visibility on zoom
        map.current?.on('zoom', () => {
          const zoomLevel = map.current?.getZoom() ?? 0;
          const visibility = zoomLevel > 12 ? 'visible' : 'none';
          map.current?.setLayoutProperty('label-layer', 'visibility', visibility);
        });

        map.current?.resize(); // Ensure proper rendering
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;