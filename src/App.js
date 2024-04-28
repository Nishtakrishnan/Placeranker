import React from "react";
import "./App.css";
import "./styles/JsonUploaderPage.css";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Register from "./components/Register";

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Set to true if the user is logged in, false otherwise
  return (
    <main className="font-inter min-w-[100vw] min-h-screen bg-eggshell flex items-center justify-center">
      <BrowserRouter>
        <Routes>
          {loggedIn ? (
            <Route path="/" element={<MainPage />} />
          ) : (
            <>
              <Route
                path="/login"
                element={<Login setLoggedIn={setLoggedIn} />}
              />
              <Route path="*" element={<Login setLoggedIn={setLoggedIn} />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </main>
  );
}
export default App;
