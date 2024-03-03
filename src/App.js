import React from 'react';
import "./App.css";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <MainPageContent />
    </div>
  );
  return <div className="App">
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
        </Routes>
      </BrowserRouter>
  </div>;
}

class MainPageContent extends React.Component {
  render() {
    return (
      <div className="Main-page">
        <h1>Placeranker</h1>
        <div className="Search-bar">
          <input type="text" placeholder="Type your city here" />
        </div>
      </div>
    );
  }
}

export default App;