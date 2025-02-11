// Custom Hook - Handles media recording logic.

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const useMediaRecorder = (questionId, setCurrentIndex, setTimeLeft) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        setMediaRecorder(recorder);
      } catch (error) {
        console.error("Permission Denied:", error);
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    if (recording && setTimeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (setTimeLeft === 0) stopRecording();
  }, [recording, setTimeLeft]);

  const startRecording = () => {
    if (!mediaRecorder) return;
    setRecording(true);
    setTimeLeft(120);
    setVideoChunks([]);
    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) setVideoChunks((prev) => [...prev, event.data]);
    };
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder.stop();
    saveAndUpload();
  };

  const saveAndUpload = async () => {
    const videoBlob = new Blob(videoChunks, { type: "video/webm" });
    const file = new File([videoBlob], `answer_${questionId}.webm`, {
      type: "video/webm",
    });

    const formData = new FormData();
    formData.append("video", file);
    formData.append("questionId", questionId);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Successful");
    } catch (error) {
      console.error("Upload Failed:", error);
    }

    setCurrentIndex((prev) => prev + 1);
    setTimeLeft(120);
  };

  return { recording, startRecording, stopRecording, videoRef };
};

export default useMediaRecorder;
