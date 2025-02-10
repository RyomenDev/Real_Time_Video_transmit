import { useEffect, useRef, useState } from "react";
import { fetchQuestions } from "../api";
import { motion } from "framer-motion";
import axios from "axios";

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
      `answer_${questions[currentIndex]?.id}.webm`,
      {
        type: "video/webm",
      }
    );

    const formData = new FormData();
    formData.append("video", file);
    formData.append("questionId", questions[currentIndex]?.id);
    formData.append("questionText", questions[currentIndex]?.text);

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
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white border-4  border-red-500">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <motion.div className="relative z-10 bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full text-gray-900">
        {questions.length > 0 && currentIndex < questions.length ? (
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-4">
              {questions[currentIndex].text}
            </h3>
            <p className="text-gray-600 mb-4">⏳ {timeLeft}s</p>
            <button
              onClick={recording ? stopRecording : startRecording}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              {recording ? "Stop & Submit" : "Start Answering"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold">✅ Interview Completed!</h2>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VideoInterview;
