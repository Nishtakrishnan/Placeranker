import React from "react";
import "../styles/MainPage.css";
import Header from "./Header";
import JsonUploader from "./JsonUploader";
import UploadButton from "./UploadButton";

const MainPage = ({ uploadFile }) => {
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
          <UploadButton></UploadButton>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
