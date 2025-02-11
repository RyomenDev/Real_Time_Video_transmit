import { useState } from "react";

const useMediaRecorder = (stream) => {
  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = () => {
    if (!stream) return;
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    setMediaRecorder(recorder);
    setRecording(true);
    setVideoChunks([]);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) setVideoChunks((prev) => [...prev, event.data]);
    };

    recorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder?.stop();
  };

  return { recording, startRecording, stopRecording, videoChunks };
};

export default useMediaRecorder;
