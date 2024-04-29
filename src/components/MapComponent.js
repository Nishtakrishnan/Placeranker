// MapComponent.js

import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/MapComponent.css";

const MapComponent = ({ markers }) => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmlzaHRha3Jpc2huYW4iLCJhIjoiY2x2MWZncDh0MDAxMjJqbGp2dzg2cTRybiJ9.RG1C1aCHCXjkiMTxfk8eUA';
    
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-88.2434, 40.1164],
      zoom: 9 
    });

    if (markers && markers.length > 0) {
      markers.forEach(marker => {
        // make a marker for each feature and add to the map
        new mapboxgl.Marker()
        .setLngLat(marker.coordinates)
        .addTo(map);
      });
    }

    // Clean up function to remove the map on unmount
    //return () => map.remove();
  }, [markers]);

  return <div id="map" />;
};

export default MapComponent;
