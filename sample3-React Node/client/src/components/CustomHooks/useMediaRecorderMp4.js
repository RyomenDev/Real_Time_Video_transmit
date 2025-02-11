import { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";

const useMediaRecorder = (stream, saveAndUpload) => {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    recorderRef.current = new RecordRTC(stream, {
      type: "video",
      mimeType: "video/mp4", // Save as MP4
      disableLogs: true,
    });
  }, [stream]);

  const startRecording = () => {
    if (!recorderRef.current) return;

    setRecording(true);
    recorderRef.current.startRecording();
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    setRecording(false);
    recorderRef.current.stopRecording(() => {
      const videoBlob = recorderRef.current.getBlob();
      saveAndUpload(videoBlob);
    });
  };

  return { recording, startRecording, stopRecording };
};

export default useMediaRecorder;
