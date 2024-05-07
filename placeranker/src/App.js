import React from "react";
import "./App.css";
import "./styles/JsonUploaderPage.css";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import EditProfile from "./components/EditProfile"
import Review from "./components/Review"
import Friends from "./components/Friends"
import Register from "./components/Register";
import MapComponent from "./components/MapComponent";
import coordinates from "./components/Coordinates"; // Import the coordinates array


function App() {
  return (
    <main className="font-inter min-w-[100vw] min-h-screen bg-eggshell flex items-center justify-center">
      <BrowserRouter>
        <Routes>
            <>
              <Route path="/editprofile" element={<EditProfile />} />
              <Route path="/review" element={<Review />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/" element={<MainPage/>} />
              <Route path="/login" element={<Login/>}/>
              <Route path="*" element={<MainPage />} />
              <Route path="/register" element={<Register />} />
            </>
        </Routes>
      </BrowserRouter>
    </main>
  );
}
export default App;
