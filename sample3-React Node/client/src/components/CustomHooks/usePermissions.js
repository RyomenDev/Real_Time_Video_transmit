import { useState, useEffect, useRef } from "react";

const usePermissions = () => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [stream, setStream] = useState(null);
  let streamRef = useRef(null);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: cameraOn,
          audio: micOn,
        });
        streamRef.current = newStream;
        setStream(newStream);
      } catch (error) {
        console.error("Permission Denied:", error);
      }
    };
    getPermissions();
  }, [micOn, cameraOn]);

  const toggleMic = () => setMicOn((prev) => !prev);
  const toggleCamera = () => setCameraOn((prev) => !prev);

  return { stream, micOn, cameraOn, toggleMic, toggleCamera };
};

export default usePermissions;
