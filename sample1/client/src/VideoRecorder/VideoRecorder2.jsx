import { useEffect, useRef, useState } from "react";
import axios from "axios";

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  let chunks = [];

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp8,opus",
        });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const videoBlob = new Blob(chunks, { type: "video/webm" });
          const videoUrl = URL.createObjectURL(videoBlob);
          setVideoUrl(videoUrl);
          saveAndUpload(videoBlob);
        };

        setMediaRecorder(recorder);
      } catch (error) {
        console.error("Permission Denied:", error);
      }
    };

    getPermissions();
  }, []);

  const startRecording = () => {
    if (!mediaRecorder) return;
    setRecording(true);
    chunks = [];
    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    setRecording(false);
    mediaRecorder.stop();
  };

  const saveAndUpload = async (videoBlob) => {
    const file = new File([videoBlob], `video_${Date.now()}.webm`, {
      type: "video/webm",
    });

    // Save locally if offline
    if (!navigator.onLine) {
      saveLocally(file);
      return;
    }

    // Upload to backend
    const formData = new FormData();
    formData.append("video", file);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Successful");
    } catch (error) {
      console.error("Upload Failed:", error);
      saveLocally(file); // Save if network fails
    }
  };

  const saveLocally = (file) => {
    const request = indexedDB.open("VideoStorage", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos", { autoIncrement: true });
      }
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("videos", "readwrite");
      const store = transaction.objectStore("videos");
      store.add(file);
      console.log("Saved locally in IndexedDB");
    };
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Video Preview */}
      {videoUrl && (
        <div>
          <h3>Recorded Video:</h3>
          <video ref={previewRef} src={videoUrl} controls />
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
