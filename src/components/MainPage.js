import React from "react";
import "../styles/MainPage.css";
import JsonUploader from "./JsonUploader";

class MainPage extends React.Component {
  render() {
    return (
      <div className="Main-page">
        <h1>Placeranker</h1>
        <div className="Search-bar">
          <input type="text" placeholder="Type your city here" />
        </div>
        <JsonUploader />
      </div>
    );
  }
}

export default MainPage;
