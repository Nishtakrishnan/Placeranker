import React, { useState, useEffect } from "react";
import { Stack, Typography, Button, Modal, Box } from "@mui/material";
import AddReviewForm from "./AddReviewForm"; // Assuming you have a separate component for adding reviews
import DropdownMenu from "./DropDownMenu";
import Login from "./Login"

const Review = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("")

  useEffect(() => {
    const status = window.localStorage.getItem("login_token");
    setUsername(status)
    setLoggedIn(status != null);
  }, []);

  useEffect(() => {
    if (username != "") {
      console.log(username)
      fetchLocations()
    }
  }, [username])

  const fetchLocations = async () => {
    try {
      const response = await fetch(`/getlocations/${username}`);
      const data = await response.json();
      console.log(data);
      setLocations(data.locations); // Ensure to set data.locations instead of just data
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleAddReview = (location) => {
    setSelectedLocation(location);
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedLocation(null);
    setOpenReviewModal(false);
  };

  return loggedIn ? (
    <div className="centered">
        <div className="absolute top-4 left-4">
        <DropdownMenu />
      </div>

      <Stack spacing={3}>
        <Typography variant="h4" gutterBottom style={{ color: "black" }}>
          Review Dashboard
        </Typography>
        
        {locations.map((location) => (
          <Stack key={location.location_id} direction="row" spacing={2}>
            <Typography style={{ color: "black" }}>{location.location_name}</Typography>
            <Typography style={{ color: "black" }}>{location.address}</Typography>
            {location.rating ? (
              <>
                <Typography style={{ color: "black" }}>{location.review}</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleAddReview(location)}
                >
                  Update Review
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => handleAddReview(location)}
              >
                Add Review
              </Button>
            )}
          </Stack>
        ))}
      </Stack>
      <Modal open={openReviewModal} onClose={handleCloseReviewModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedLocation && ( // Ensure selectedLocation is not null before rendering AddReviewForm
            <AddReviewForm
              location={selectedLocation}
              onSubmitReview={handleCloseReviewModal}
              // Pass additional props here
              locationProps={{
                location_id: selectedLocation.location_id,
                longitude: selectedLocation.longitude,
                rating: selectedLocation.rating,
                comment: selectedLocation.comment,
                latitude: selectedLocation.latitude,
                google_maps_url: selectedLocation.google_maps_url,
                location_name: selectedLocation.location_name,
                address: selectedLocation.address
              }}
            />
          )}
        </Box>
      </Modal>
    </div>
  ) : <Login/>
};

export default Review;
