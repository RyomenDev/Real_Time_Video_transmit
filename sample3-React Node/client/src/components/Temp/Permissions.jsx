import { useState } from "react";

const Permissions = ({ onPermissionsGranted }) => {
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled,
        audio: micEnabled,
      });
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      onPermissionsGranted(stream, recorder);
    } catch (error) {
      console.error("Permission Denied:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md text-gray-900">
      <h3 className="text-lg font-semibold mb-4">Grant Permissions</h3>
      <div className="flex space-x-4">
        <button
          onClick={() => setMicEnabled((prev) => !prev)}
          className={`px-4 py-2 rounded-lg ${
            micEnabled ? "bg-green-500" : "bg-gray-400"
          } text-white`}
        >
          {micEnabled ? "Mic Enabled" : "Enable Mic"}
        </button>
        <button
          onClick={() => setCameraEnabled((prev) => !prev)}
          className={`px-4 py-2 rounded-lg ${
            cameraEnabled ? "bg-green-500" : "bg-gray-400"
          } text-white`}
        >
          {cameraEnabled ? "Camera Enabled" : "Enable Camera"}
        </button>
      </div>
      <button
        onClick={requestPermissions}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Grant Access
      </button>
    </div>
  );
};

export default Permissions;
