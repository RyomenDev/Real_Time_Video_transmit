import { useState, useEffect } from "react";
import { fetchQuestions } from "../api";
import VideoRecorder from "./VideoRecorder";
import QuestionDisplay from "./QuestionDisplay";

const VideoInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchQuestions();
      setQuestions(data);
    };
    loadQuestions();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
      {questions.length > 0 && currentIndex < questions.length ? (
        <VideoRecorder
          question={questions[currentIndex]}
          onNext={() => setCurrentIndex((prev) => prev + 1)}
        />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">✅ Interview Completed!</h2>
        </div>
      )}
    </div>
  );
};

export default VideoInterview;
