import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../styles/MapComponent.css";
import DropdownMenu from './DropDownMenu';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Stack } from '@mui/material';

const MapComponent = ({ markers }) => {
  const [locations, setLocations] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [ratingResponse, setRatingResponse] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const status = window.localStorage.getItem("login_token");
    setUsername(status);
  }, []);

  useEffect(() => {
    if (username !== "") {
      const fetchData = async () => {
        try {
          const locationData = await fetchLocationData();
          setLocations(locationData["locations"]);
        } catch (error) {
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
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    if (selectedLocation != null) {
      const fetchReviews = async () => {
        const response = await fetch(`/get_ratings/${selectedLocation.location_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json()
        setRatingResponse(data.ratings)
      }
      fetchReviews()
    } else {
      setRatingResponse([])
    }
  }, [selectedLocation])

  useEffect(() => {
    if (locations.length > 0) {
      mapboxgl.accessToken = 'pk.eyJ1IjoibmlzaHRha3Jpc2huYW4iLCJhIjoiY2x2MWZncDh0MDAxMjJqbGp2dzg2cTRybiJ9.RG1C1aCHCXjkiMTxfk8eUA';

      let averageLatitude = 0.0;
      let averageLongitude = 0.0;
      for (const location of locations) {
        averageLatitude += location.latitude;
        averageLongitude += location.longitude;
      }

      averageLatitude /= locations.length;
      averageLongitude /= locations.length;

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [averageLatitude, averageLongitude],
        zoom: 18
      });

      for (const location of locations) {
        const content = `<div>
                    <p>${location.location_name}</p>
                    <p>${location.address}</p>
                  </div>`;
        const marker = new mapboxgl.Marker({ color: "green" })
          .setLngLat([location.latitude, location.longitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(content))
          .addTo(map);

        // Attach click event listener to the marker
        marker.getElement().addEventListener('click', (e) => {
          console.log(e)
          setSelectedLocation(location);
        });
      }
    }
  }, [locations]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <Stack direction="row" sx={{width : '100%'}}>
        <div className="absolute top-4 left-4">
          <DropdownMenu />
        </div>
        {selectedLocation && (
          <div className="ratings-div" style={{ width: '50%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Stack sx={{width : "100%", height : "70%"}}>
              <Typography variant="h5">Ratings for {selectedLocation.location_name}:</Typography>
              <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? ratingResponse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : ratingResponse
                    ).map((rating, index) => (
                      <TableRow key={index}>
                        <TableCell>{rating.username}</TableCell>
                        <TableCell>{rating.rating}</TableCell>
                        <TableCell>{rating.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={ratingResponse.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Stack>
          </div>
        )}
        <div id="map" className="map" />
      </Stack>
  );
};

export default MapComponent;
