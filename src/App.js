import React from "react";
import "./App.css";
import "./styles/JsonUploaderPage.css";
import Login from "./components/Login";
import JsonUploaderPage from "./components/JsonUploaderPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(true); // Set to true if the user is logged in, false otherwise
  return (
    <BrowserRouter>
      <Routes>
        {loggedIn ? (
          <Route path="/" element={<JsonUploaderPage />} />
        ) : (
          <>
            <Route
              path="/login"
              element={<Login setLoggedIn={setLoggedIn} />}
            />
            <Route path="*" element={<Login setLoggedIn={setLoggedIn} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
