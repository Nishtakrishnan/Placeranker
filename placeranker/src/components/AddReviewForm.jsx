import React, { useState, useEffect } from "react";
import { Stack, TextField, Button, Alert, Rating, Typography } from "@mui/material";

const AddReviewForm = ({ onSubmitReview, location }) => {
  const [stars, setStars] = useState(location.rating || 0);
  const [review, setReview] = useState(location.comment || "");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    const data = {
      stars: stars,
      review: review,
      location_id: location.location_id,
      rating_id: location.rating_id
    };

    try {
      const response = await fetch("/submit_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        onSubmitReview();
      } else {
        console.error("Error submitting review:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div>
      <Stack
        color="#E84A27"
        spacing={3.5}
        sx={{
          borderRadius: 3,
          boxShadow: 5,
          alignItems: "center",
          backgroundColor: "#EDE9E8",
        }}
        p={7}
      >
        <Typography variant="h4" gutterBottom>
          {location.comment ? "Edit Review" : "Add Review"}
        </Typography>
        <Rating
          name="stars"
          value={stars}
          onChange={(event, newValue) => {
            setStars(newValue);
          }}
        />
        <TextField
          label="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ width: "100%" }}
          multiline
          rows={4}
        />
        <Button onClick={handleSubmit} variant="contained">
          {location.comment ? "Update Review" : "Submit Review"}
        </Button>
        {submitSuccess && (
          <Alert severity="success" sx={{ width: "50%" }}>
            Review {location.comment ? "updated" : "submitted"} successfully!
          </Alert>
        )}
      </Stack>
    </div>
  );
};

export default AddReviewForm;
