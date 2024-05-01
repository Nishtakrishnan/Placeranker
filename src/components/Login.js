import {
  Typography,
  Stack,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const Login = (props) => {
  const { setLoggedIn } = props;
  const [failedLogin, setFailedLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const status = window.localStorage.getItem("token");
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
    // Make a get request to the database, to see if the password matches
    // REMEMBER TO PUT GET REQUEST HERE
    const data = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch(`/login/${username}/${password}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        const data = await response.json();
        if (data.successful) {
          window.localStorage.setItem("token", username);
          setLoggedIn(true);
          window.location.assign("/home");
        }
      } else {
        setFailedLogin(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="centered w-[30%]">
      <Stack
        color="#29261B"
        spacing={3.5}
        sx={{
          borderRadius: 3,
          alignItems: "center",
          backgroundColor: "#F6EFE4",
        }}
        p={7}
      >
        <div className="place">
          <h1 className="text-4xl">Placeranker</h1>
        </div>
        <h4 className="text-xl">Don't have an account?</h4>
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
