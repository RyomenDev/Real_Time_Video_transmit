import { useEffect, useRef, useState } from "react";
import QuestionDisplay from "./QuestionDisplay";
import Permissions from "./Permissions";
import axios from "axios";

const VideoRecorder = ({ question, onNext }) => {
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (recording && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) stopRecording();
  }, [recording, timeLeft]);

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
    mediaRecorder?.stop();
    saveAndUpload();
  };

  const saveAndUpload = async () => {
    const videoBlob = new Blob(videoChunks, { type: "video/webm" });
    const file = new File([videoBlob], `answer_${question.id}.webm`, {
      type: "video/webm",
    });

    const formData = new FormData();
    formData.append("video", file);
    formData.append("questionId", question.id);
    formData.append("questionText", question.text);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload Successful");
    } catch (error) {
      console.error("Upload Failed:", error);
    }

    onNext();
    setTimeLeft(120);
  };

  return (
    <div className="relative w-full max-w-xl">
      <video ref={videoRef} autoPlay playsInline className="w-full h-64" />
      {!permissionsGranted ? (
        <Permissions
          onPermissionsGranted={(stream, recorder) => {
            videoRef.current.srcObject = stream;
            setMediaRecorder(recorder);
            setPermissionsGranted(true);
          }}
        />
      ) : (
        <QuestionDisplay
          question={question}
          timeLeft={timeLeft}
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      )}
    </div>
  );
};

export default VideoRecorder;
