import { CameraIcon } from "@heroicons/react/24/outline";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import Video from "../components/Camera/Video";
import Review from "../components/Camera/Review";



export default function Scan() {
  
  const [current, setCurrent] = useState("scan");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const uploadRef = useRef<HTMLInputElement>(null);

  if (current === "review") {
    return (
      <Review
        capturedImage = {capturedImage}
        onCancel = { () => {
          setCapturedImage(null);
          setCurrent("scan");
        }}
      />
      );
    }

  if (current === "camera") {
    return ( 
    <Video 
      capturedImage = {capturedImage}
      setCapturedImage = {setCapturedImage}
      onConfirm = {() => setCurrent("review")}
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
              const imageURL = URL.createObjectURL(file);
              setCapturedImage(imageURL);
              setCurrent("review");
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