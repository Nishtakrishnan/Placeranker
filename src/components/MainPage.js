import React from "react";
import "../styles/MainPage.css";

class MainPage extends React.Component {
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

export default MainPage;
