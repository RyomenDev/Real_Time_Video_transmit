import { useState, useEffect, useRef } from "react";

const usePermissions = () => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [stream, setStream] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = newStream;
        setStream(newStream);
      } catch (error) {
        console.error("Permission Denied:", error);
      }
    };

    getPermissions();
  }, []);

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
    }
    setMicOn((prev) => !prev);
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !cameraOn;
      });
    }
    setCameraOn((prev) => !prev);
  };

  return { stream, micOn, cameraOn, toggleMic, toggleCamera };
};

export default usePermissions;
