import React, { useEffect, useState } from "react";
import {
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Chip,
} from "@mui/material";
import Login from "./Login";

const Register = (props) => {
  const boxWidth = "75%";
  const [failedRegistration, setFailedRegistration] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const status = window.localStorage.getItem("token");
    setLoggedIn(status != null);
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handlePasswordConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value);
    if (e.target.value !== password) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const onSubmit = async () => {
    if (!username.trim()) {
      setUsernameError(true);
      return;
    }
    if (!password.trim()) {
      setPasswordError(true);
      return;
    }
    if (password !== passwordConfirmation) {
      setPasswordMatchError(true);
      return;
    }
    // Make a post request to the database, create new user with info
    const data = {
      password: password,
    };

    console.log(data);
    // Update database
    try {
      const response = await fetch(
        `/create/${username}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(data);
      if (response.status == 200) {
        const data = await response.json();
        if (data.successful) {
          window.localStorage.setItem("token", username);
          setLoggedIn(true);
          window.location.assign("/home"); //new
        }
      } else {
        setFailedRegistration(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return loggedIn ? (
    <Login />
  ) : (
    <div className="centered w-[30%]">
      <Stack
        color="#29261B"
        spacing={3}
        sx={{
          alignItems: "center",
          backgroundColor: "#F6EFE4",
        }}
        p={6}
      >
        <div className="register-meet text-4xl text-center">
          <h1>Placeranker</h1>
        </div>
        <div>
          <h1 className="text-2xl">Register</h1>
        </div>
        <TextField
          id="outlined-basic-username"
          label="Username"
          size="small"
          sx={{ width: boxWidth }}
          value={username}
          onChange={handleUsernameChange}
          error={usernameError}
          helperText={usernameError ? "Please enter a valid username" : ""}
        />
        <TextField
          id="outlined-basic-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          size="small"
          sx={{ width: boxWidth }}
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
          helperText={passwordError ? "Please enter a valid password" : ""}
        />
        <TextField
          id="outlined-basic-password-confirmation"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          size="small"
          sx={{ width: boxWidth }}
          value={passwordConfirmation}
          onChange={handlePasswordConfirmationChange}
        />
        {passwordMatchError && (
          <Alert severity="error" variant="filled">
            Passwords do not match!
          </Alert>
        )}
        {failedRegistration && (
          <Alert
            severity="error"
            onClose={() => {
              setFailedRegistration(false);
            }}
            variant="filled"
          >
            Username already exists!
          </Alert>
        )}
        <Button onClick={togglePasswordVisibility} variant="contained">
          {showPassword ? "Hide Password" : "Show Password"}
        </Button>
        <Button onClick={onSubmit} variant="contained">
          Register
        </Button>
      </Stack>
    </div>
  );
};

export default Register;