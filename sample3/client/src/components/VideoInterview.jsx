import { useEffect, useState } from "react";
import { fetchQuestions } from "../api";
import useMediaRecorder from "./useMediaRecorder";
import VideoFeed from "./VideoFeed";
import QuestionDisplay from "./QuestionDisplay";

const VideoInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  const { recording, startRecording, stopRecording, videoRef } =
    useMediaRecorder(questions[currentIndex]?.id, setCurrentIndex, setTimeLeft);

  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchQuestions();
      setQuestions(data);
    };
    loadQuestions();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white border-4 border-red-500">
      <VideoFeed videoRef={videoRef} />
      <div className="relative z-10 bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full text-gray-900">
        {questions.length > 0 && currentIndex < questions.length ? (
          <QuestionDisplay
            question={questions[currentIndex]}
            timeLeft={timeLeft}
            recording={recording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold">✅ Interview Completed!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInterview;
