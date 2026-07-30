import { useEffect, useRef} from "react";


type VideoProp = {
  capturedImage: string | null;
  setCapturedImage: React.Dispatch<React.SetStateAction<string | null>>;
  onConfirm: () => void;
};

export default function Video({
  capturedImage,
  setCapturedImage,
  onConfirm,
}: VideoProp) {


  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment"
          }
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  }

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };

  }, []);


  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;


    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0);
    }

    const image = canvas.toDataURL("image/png", 0.9);
    
    setCapturedImage(image);

  }

  function retake() {
    setCapturedImage(null);

    setTimeout(() => {
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    }, 0);

  }


  return ( 
    <div className = "camera-page">
      <canvas ref = {canvasRef} style = {{display: "none" }} /> 
      {!capturedImage && ( 
        <div className = "camera-container">

          <video ref={videoRef} autoPlay playsInline className = "video-cam" />


          <div className = "camera-tools"> 
            <button className = "capture-button" onClick = {capture}>
              <div className = "capture-circle"> </div>
            </button>
          </div>
          
        </div>
      )}


      { capturedImage && (
        <div className = "review-camera">
          <img src = {capturedImage} className = "preview-image" />
          
          <div className = "photo-buttons"> 

            <button className = "retake-button" onClick = {retake}> 
              Retake photo
            </button>

            <button className = "confirm-button" onClick = {onConfirm}>
              Confirm
            </button>

          </div> 

        </div>
      )}

    </div>

  );

}