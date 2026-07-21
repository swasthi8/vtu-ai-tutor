import { useState } from "react";
import "./Upload.css";
import { uploadPDF } from "../services/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠ Please select a PDF file first.");
      return;
    }

    try {
      const result = await uploadPDF(file);

      setMessage(
        `✅ PDF Uploaded Successfully!\n
Filename: ${result.filename}
Characters: ${result.characters}
Chunks Created: ${result.chunks_created}`
      );
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to upload PDF.");
    }
  };

  return (
    <div className="upload-page">
      <h1>📄 Upload VTU Notes</h1>

      <p>Select a PDF file to upload for AI analysis.</p>

      <div className="upload-box">

        <label className="drop-zone">

          <input
            type="file"
            accept=".pdf"
            className="file-input"
            onChange={handleFileChange}
          />

          <div className="upload-icon">📄</div>

          <h2>Drag & Drop PDF Here</h2>

          <p>or Click to Browse</p>

        </label>

        {file && (
          <div className="file-info">
            <h3>Selected File</h3>
            <p>{file.name}</p>
          </div>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
        >
          Upload PDF
        </button>

        {message && (
          <div className="file-info">
            <pre>{message}</pre>
          </div>
        )}

      </div>
    </div>
  );
}

export default Upload;