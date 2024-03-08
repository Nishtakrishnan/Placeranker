import React from 'react';
import "./App.css";
import "./styles/MainPage.css"
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const loggedIn = true; // Set to true if the user is logged in, false otherwise
  return (
    <BrowserRouter>
      <Routes>
        {loggedIn ? (
          <Route path="/" element={<MainPage/>} />
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;