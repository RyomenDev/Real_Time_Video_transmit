import { useEffect, useRef, useState } from "react";
import { fetchQuestions } from "./api";
import axios from "axios";

const VideoInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2-minute timer
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
      `answer_${questions[currentQuestionIndex].id}.webm`,
      { type: "video/webm" }
    );

    const formData = new FormData();
    formData.append("video", file);
    formData.append("questionId", questions[currentQuestionIndex].id);
    formData.append("questionText", questions[currentQuestionIndex].text);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Successful");
    } catch (error) {
      console.error("Upload Failed:", error);
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setTimeLeft(120);
  };

  return (
    <div className="container">
      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <>
          <h2>{questions[currentQuestionIndex].text}</h2>
          <p>Time Left: {timeLeft}s</p>
          <video ref={videoRef} autoPlay playsInline />
          <button onClick={recording ? stopRecording : startRecording}>
            {recording ? "Stop & Submit" : "Start Answering"}
          </button>
        </>
      ) : (
        <h2>Interview Completed!</h2>
      )}
    </div>
  );
};

export default VideoInterview;
