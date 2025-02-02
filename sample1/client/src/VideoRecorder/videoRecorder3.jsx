import { useEffect, useRef, useState } from "react";
import axios from "axios";

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  let chunks = [];

  useEffect(() => {
    getUploadedVideos();
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

        videoRef.current.recorder = recorder;
      } catch (error) {
        console.error("Permission Denied:", error);
      }
    };

    getPermissions();
  }, []);

  const startRecording = () => {
    if (!videoRef.current.recorder) return;
    setRecording(true);
    chunks = [];
    videoRef.current.recorder.start();
  };

  const stopRecording = () => {
    if (!videoRef.current.recorder) return;
    setRecording(false);
    videoRef.current.recorder.stop();
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
      getUploadedVideos(); // Refresh uploaded videos
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

  const getUploadedVideos = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/videos");
      setUploadedVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div>
      <h2>Video Recorder</h2>
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

      {/* Uploaded Videos List */}
      <h2>Uploaded Videos</h2>
      {uploadedVideos.length > 0 ? (
        <ul>
          {uploadedVideos.map((video) => (
            <li key={video.filename}>
              <a
                href={`http://localhost:5000${video.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.filename}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No videos uploaded yet.</p>
      )}
    </div>
  );
};

export default VideoRecorder;
