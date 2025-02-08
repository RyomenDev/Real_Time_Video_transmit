import { useEffect, useRef, useState } from "react";
import { fetchQuestions } from "../api";
import axios from "axios";
import "./styles.css";

const VideoInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchQuestions();
      setQuestions(data);
    };
    loadQuestions();
  }, []);

  useEffect(() => {
    if (recording && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) stopRecording();
  }, [recording, timeLeft]);

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
    const file = new File(
      [videoBlob],
      `answer_${questions[currentIndex].id}.webm`,
      {
        type: "video/webm",
      }
    );

    const formData = new FormData();
    formData.append("video", file);
    formData.append("questionId", questions[currentIndex].id);
    formData.append("questionText", questions[currentIndex].text);

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

  return (
    <div className="interview-container">
      <div className="header">
        <h2>Mock Interview</h2>
        <span className="brand">Thynkr</span>
      </div>

      {questions.length > 0 && currentIndex < questions.length ? (
        <div className="interview-box">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="video-preview"
          />
          <div className="question-box">
            <h3>{questions[currentIndex].text}</h3>
            <p className="timer">Time Left: {timeLeft}s</p>
            <button
              onClick={recording ? stopRecording : startRecording}
              className="record-btn"
            >
              {recording ? "Stop & Submit" : "Start Answering"}
            </button>
          </div>
        </div>
      ) : (
        <div className="completed-box">
          <h2>Interview Completed!</h2>
        </div>
      )}
    </div>
  );
};

export default VideoInterview;
