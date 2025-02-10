// Displays the current question and controls for recording.

const QuestionDisplay = ({
  question,
  timeLeft,
  recording,
  startRecording,
  stopRecording,
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
      <p className="text-gray-600 mb-4">⏳ {timeLeft}s</p>
      <button
        onClick={recording ? stopRecording : startRecording}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        {recording ? "Stop & Submit" : "Start Answering"}
      </button>
    </div>
  );
};

export default QuestionDisplay;
