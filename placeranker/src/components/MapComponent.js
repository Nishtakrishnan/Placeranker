import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/MapComponent.css";
import DropdownMenu from './DropDownMenu';
import { Typography } from '@mui/material';

const MapComponent = ({ markers }) => {
  const [locations, setLocations] = useState([])
  const [username, setUsername] = useState("")

  useEffect(() => {
    const status = window.localStorage.getItem("login_token");
    console.log(status);
    setUsername(status)
  }, [])  

  useEffect(() => {
    console.log("username change")
    if (username !== "") {
      const fetchData = async () => {
        try {
          const location_data = await fetchLocationData();
          console.log("Location data:", location_data)
          setLocations(location_data["locations"])
        } catch (error) {
          // Handle errors
          console.error("Error fetching location data:", error);
        }
      }; 
      fetchData();
    }
  }, [username]);

  const fetchLocationData = async () => {
    const response = await fetch(`/getlocations/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json()
    return data
  }

  useEffect(() => {
    if (locations.length > 0) {
      mapboxgl.accessToken = 'pk.eyJ1IjoibmlzaHRha3Jpc2huYW4iLCJhIjoiY2x2MWZncDh0MDAxMjJqbGp2dzg2cTRybiJ9.RG1C1aCHCXjkiMTxfk8eUA';

      let average_latitude = 0.0
      let average_longitude = 0.0
      for (const location of locations) {
        console.log(location)
        average_latitude += location.latitude
        average_longitude += location.longitude
      }

      console.log("Latitude", average_latitude)
      console.log("Longitude", average_latitude)

      average_latitude /= locations.length
      average_longitude /= locations.length

      console.log("Latitude", average_latitude)
      console.log("Longitude", average_latitude)
      
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [average_latitude, average_longitude],
        zoom: 18
      });

      console.log(locations)
      for (const location of locations) {
        console.log(location.location_name)
        var marker = new mapboxgl.Marker({color : "green"})
                        .setLngLat([location.latitude, location.longitude])
                        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.location_name))
                        .addTo(map)
      }
    }
  }, [locations]);

  return (
    <div className="map-container">
      <div className="absolute top-4 left-4">
        <DropdownMenu />
      </div>
      <div id="map" className="map" />
    </div>
  );
};

export default MapComponent;
