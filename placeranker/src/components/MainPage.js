import React from "react";
import "../styles/MainPage.css";
import Header from "./Header";
import { useState } from "react";
import UploadButton from "./UploadButton";

const MainPage = ({ uploadFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Please upload a JSON file.");
    }
  };

  async function handleUpload(file) {
    if (selectedFile) {
      // Here you can handle the file upload, e.g., send it to a server
      const formData = new FormData();
      formData.append("files", file);
      const requestOptions = { method: "POST", body: formData };
      const response = await fetch("/api/upload", requestOptions);
    } else {
      console.error("No file selected");
    }
  }

  return (
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
          <UploadButton handleUpload={handleUpload}></UploadButton>
        </div>
      </div>
    </div>
  );
};

export default MainPage;