import React from "react";
import "../styles/MainPage.css";
import Header from "./Header";
import { useEffect, useState } from "react";
import UploadButton from "./UploadButton";
import MapComponent from "./MapComponent";
import Login from "./Login";

const MainPage = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [locationJson, setLocationJson] = useState(null);
  const [username, setUsername] = useState("")
  const [uploadedJson, setUploadedJson] = useState(false)

  useEffect (() => {
    const status = window.localStorage.getItem("login_token");
    console.log(status);
    setUsername(status)
    setLoggedIn(status != null)
  }, [])

  useEffect(() => {
    console.log("username change")
    if (username != "") {
      const fetchData = async () => {
        try {
          const location_data = await fetchLocationData();
          console.log("Location data:", location_data)
          if (location_data?.locations.length === 0) {
            setUploadedJson(false);
          } else {
            setUploadedJson(true);
          }
        } catch (error) {
          // Handle errors
          console.error("Error fetching location data:", error);
        }
      }; 
      fetchData();
    }
  }, [username]);

  const fetchLocationData = async () => {
    const response = await fetch(`/getlocations/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json()
    return data
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const parsedData = JSON.parse(contents);
      setLocationJson(parsedData);
      console.log(parsedData)
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (locationJson != null) {
      console.log(locationJson)
      const uploadLocationData = async () => {
        const response = await fetch(`/addlocations/${username}`, {
          method : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body : JSON.stringify(locationJson),
        })
        if (response.status == 200) {
          setUploadedJson(true)
        }
      }
      uploadLocationData();
    }
  }, [locationJson])

  return loggedIn ? (uploadedJson ? 
  <MapComponent/> : 
  (
    <div className="bg-eggshell font-inter text-[#29261B] flex flex-col min-h-screen items-center justify-between py-24">
      <div className="md:max-w-[600px] flex flex-col gap-10">
        <Header></Header>
        <div className={`w-full flex flex-col gap-6`}>
          <p>
            Welcome to placeranker! Google Maps is nice for when you know where
            you want to go, but what if you don't? You can't rank your saved
            places by any metric in Google Maps. Placeranker lets you do that,
            and much more.
          </p>
          <UploadButton handleUpload={handleFileUpload}></UploadButton>
        </div>
      </div>
    </div>
  ))
  : (<Login/>)
};

export default MainPage;