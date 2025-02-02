import { useState } from "react";
import axios from "axios";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/videos");
      setVideos(data);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div>
      <h2>Recorded Videos</h2>
      <button
        onClick={fetchVideos}
        className="p-2 bg-blue-500 text-white rounded-lg mb-4"
      >
        Fetch Videos
      </button>
      {loaded && videos.length === 0 && <p>No videos recorded yet.</p>}
      {videos.length > 0 && (
        <div>
          {videos.map((video, index) => (
            <div key={index} className="mb-4">
              <h3>Answer {index + 1}</h3>
              <video controls width="400">
                <source
                  src={`http://localhost:5000/uploads/${video}`}
                  type="video/webm"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
