import { CameraIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Video from "../components/Camera/Video";
import { scanItem } from "../services/items";

//This splits on the comma to separate the metadata header from the actual base64 payload
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64Data] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

  const byteString = atob(base64Data);
  const bytes = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export default function Scan() {
  
  const [current, setCurrent] = useState("scan");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [source, setSource] = useState<"camera" | "upload">("camera");
  const uploadRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();


  async function handleConfirm() {
    const blob = capturedFile ?? (capturedImage ? dataUrlToBlob(capturedImage) : null);
    if(!blob) return;

    setUploading(true);
    setUploadError(null);

    try {
      const {item_id} = await scanItem(blob);
      navigate(`/items/${item_id}/review`);
    } catch (err) {
      setUploadError("Something went wrong uploading your photo. Please try again.");
      setUploading(false);
    }
  }

  function handleRetakeUpload() {
    setCapturedFile(null);
    setCapturedImage(null);
    uploadRef.current?.click();
  }

  if (current === "camera") {
    return (
      <Video
        capturedImage = {capturedImage}
        setCapturedImage = {setCapturedImage}
        onConfirm = {handleConfirm}
        uploading = {uploading}
        uploadError = {uploadError}   
        source={source}
        onRetakeUpload={handleRetakeUpload}
      />
      );
    }

  return (
    <div className = "scan-page">

      <div className = "scan-desc"> 
          Take a photo or upload an existing image of an item to add it to your inventory.
      </div>

      <div className = "scan-buttons">
        
        <button className = "scan-button" onClick={() => setCurrent("camera")}>
          <CameraIcon className = "w-5 h-5" />
            Scan Item
        </button>

        <div className = "scan-line"> </div>

        <input 
          ref = {uploadRef}
          type = "file"
          accept = "image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setCapturedFile(file);
              setCapturedImage(URL.createObjectURL(file));
              setCurrent("camera");
            }

            e.target.value = "";

          }}
          />

        <button 
          className = "upload-button"
          onClick = {() => uploadRef.current?.click()}
        > 
        
          <ArrowUpTrayIcon className = "w-5 h-5" />
          Upload Image
        </button>

      </div>

    </div>
  );
}