import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";

const JsonUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert("Please upload a JSON file.");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Here you can handle the file upload, e.g., send it to a server
      console.log("Uploading file...", selectedFile);
    } else {
      console.error("No file selected");
    }
  };

  return (
    <Box p={3} border="1px dashed #ccc" borderRadius={8} textAlign="center">
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="json-file-input"
      />
      <label htmlFor="json-file-input">
        <Button variant="outlined" component="span">
          Select JSON File
        </Button>
      </label>
      {selectedFile && (
        <div>
          <Typography variant="subtitle1" mt={2}>
            Selected File: {selectedFile.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            mt={2}
          >
            Upload
          </Button>
        </div>
      )}
    </Box>
  );
};

export default JsonUpload;
