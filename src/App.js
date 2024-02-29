import React from 'react';
import "./App.css";

function App() {
  return (
    <div className="App">
      <MainPageContent />
    </div>
  );
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