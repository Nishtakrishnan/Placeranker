import {
  Typography,
  Stack,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MainPage from "./MainPage";

const Login = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const onSubmit = async () => {
    try {
      const response = await fetch(`/login/${username}/${password}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response)
      if (response.status === 200) {
        const data = await response.json();
        window.localStorage.setItem("login_token", username);
        setLoggedIn(true);
      } else {
        setFailedLogin(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return loggedIn ? (<MainPage/>) :
  (
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
        <div className="place">
          <Typography variant="h2">Placeranker</Typography>
        </div>
        <Typography variant="h6">Don't have an account?</Typography>
        <Link href="/register">{"Register here."}</Link>
        <TextField
          id="outlined-basic"
          label="Username"
          sx={{ width: "50%" }}
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          type="password"
          sx={{ width: "50%" }}
          value={password}
          onChange={handlePasswordChange}
        />
        {failedLogin && (
          <Alert
            severity="error"
            onClose={() => {
              setFailedLogin(false);
            }}
            variant="filled"
          >
            Invalid Credentials
          </Alert>
        )}
        <Button onClick={onSubmit} variant="contained">
          Login
        </Button>
      </Stack>
    </div>
  );
};

export default Login;
