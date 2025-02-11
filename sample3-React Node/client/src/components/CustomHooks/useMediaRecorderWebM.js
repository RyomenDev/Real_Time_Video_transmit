import { useState, useEffect, useRef } from "react";

const useMediaRecorder = (stream, saveAndUpload) => {
  const [recording, setRecording] = useState(false);
  //   const [videoChunks, setVideoChunks] = useState([]);
  const videoChunksRef = useRef([]); // Use ref to persist data
  const mediaRecorderRef = useRef(null);
  //   const chunksRef = useRef([]); // Use a ref to store video chunks

  useEffect(() => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        // chunksRef.current.push(event.data); // Push to ref instead of state
        videoChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      //   console.log("Recorder stopped");
      // Ensure it's an array before creating Blob
      if (videoChunksRef.current.length > 0) {
        await saveAndUpload([...videoChunksRef.current]); // Pass a copy of chunks
        videoChunksRef.current = []; // Reset after upload
      }
      //   if (chunksRef.current.length > 0) {
      //     // console.log("now-saveAndUpload");
      //     const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
      //     await saveAndUpload(videoBlob);
      //     chunksRef.current = []; // Clear ref storage after upload
      //   }
    };

    mediaRecorderRef.current = recorder;
  }, [stream]);

  const startRecording = () => {
    // console.log("Starting recording");

    if (!mediaRecorderRef.current) return;

    setRecording(true);
    // chunksRef.current = []; // Clear previous recordings
    videoChunksRef.current = []; // Reset before new recording
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    // console.log("Stopping recording");

    if (!mediaRecorderRef.current) return;

    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  return { recording, startRecording, stopRecording };
};

export default useMediaRecorder;
