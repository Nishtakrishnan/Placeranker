import { Typography, Stack, TextField, Button, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import DropdownMenu from "./DropDownMenu";
import Login from "./Login"

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const status = window.localStorage.getItem("login_token");
    console.log(status);
    setLoggedIn(status != null);
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const onSubmit = async () => {
    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      setUpdateError(true);
      return;
    }

    try {
      // Make a PUT request to update the user's profile
      const response = await fetch(`/updateProfile/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, newPassword }),
      });

      if (response.ok) {
        setUpdateSuccess(true);
        setUpdateError(false);
      } else {
        setUpdateError(true);
        setUpdateSuccess(false);
      }
    } catch (e) {
      console.log(e);
      setUpdateError(true);
      setUpdateSuccess(false);
    }
  };

  return loggedIn ? (
    <div className="centered">
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
      <div className="absolute top-4 left-4">
        <DropdownMenu />
      </div>

        <div className="place">
          <Typography variant="h2">Edit Profilesss</Typography>
        </div>
        <TextField
          id="outlined-basic"
          label="Username"
          sx={{ width: "50%" }}
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          id="outlined-basic"
          label="Current Password"
          type="password"
          sx={{ width: "50%" }}
          value={password}
          onChange={handlePasswordChange}
        />
        <TextField
          id="outlined-basic"
          label="New Password"
          type="password"
          sx={{ width: "50%" }}
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
        <TextField
          id="outlined-basic"
          label="Confirm New Password"
          type="password"
          sx={{ width: "50%" }}
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
        />
        {updateSuccess && (
          <Alert severity="success" onClose={() => setUpdateSuccess(false)}>
            Profile updated successfully!
          </Alert>
        )}
        {updateError && (
          <Alert severity="error" onClose={() => setUpdateError(false)}>
            Failed to update profile. Please check your credentials.
          </Alert>
        )}
        <Button onClick={onSubmit} variant="contained">
          Update Profile
        </Button>
      </Stack>
    </div>
  ) : <Login/>
};

export default EditProfile;