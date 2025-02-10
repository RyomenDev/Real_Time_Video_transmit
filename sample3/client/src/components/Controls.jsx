const Controls = ({
  recording,
  startRecording,
  stopRecording,
  micOn,
  cameraOn,
  toggleMic,
  toggleCamera,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        {recording ? "Stop & Submit" : "Start Answering"}
      </button>
      <div className="flex gap-4">
        <button
          onClick={toggleMic}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          {micOn ? "Turn Mic Off" : "Turn Mic On"}
        </button>
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
        </button>
      </div>
    </div>
  );
};

export default Controls;
