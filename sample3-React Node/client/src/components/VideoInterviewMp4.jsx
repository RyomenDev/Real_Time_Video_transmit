import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { fetchQuestions } from "../api";
import useMediaRecorder from "./CustomHooks/useMediaRecorderWebm";
import usePermissions from "./CustomHooks/usePermissions";
import Controls from "./Controls";

const VideoInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const videoRef = useRef(null);

  const { stream, cameraOn, micOn, toggleCamera, toggleMic } = usePermissions();
  const { recording, startRecording, stopRecording } = useMediaRecorder(
    stream,
    saveAndUpload
  );

  const skipQuestion = () => {
    setCurrentIndex((prev) => prev + 1);
    setSkippedCount((prev) => prev + 1);
    setTimeLeft(120);
  };

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
  }, [recording, stopRecording, timeLeft]);

  useEffect(() => {
    if (stream) videoRef.current.srcObject = stream;
  }, [stream]);

  async function saveAndUpload(videoBlob) {
    if (!questions[currentIndex]) return;

    const file = new File(
      [videoBlob],
      `answer_${questions[currentIndex]?.id || currentIndex}.mp4`,
      { type: "video/mp4" }
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
  }

  return (
    <div className="h-screen w-full flex items-end justify-center bg-gray-900 text-white">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <motion.div className="relative z-10 p-6 rounded-2xl shadow-lg mx-10 w-full text-gray-900">
        {questions.length > 0 && currentIndex < questions.length ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col items-center w-full rounded-xl px-2 bg-white">
              <h3 className="text-xl font-semibold mb-4 flex items-start w-full rounded-xl p-2 bg-white">
                {questions[currentIndex].text}
              </h3>
              <div className="flex flex-col items-end w-full">
                <div className="text-gray-600 mb-2">
                  Question {currentIndex + 1} / {questions.length} | Skipped:{" "}
                  {skippedCount}
                  <button
                    onClick={skipQuestion}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Skip Question
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">⏳ {timeLeft}s</p>
            <div>
              <Controls
                recording={recording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                micOn={micOn}
                cameraOn={cameraOn}
                toggleMic={toggleMic}
                toggleCamera={toggleCamera}
              />
            </div>
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
