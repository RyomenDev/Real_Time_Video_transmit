import { useEffect, useState } from "react";
import axios from "axios";

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await axios.get("http://localhost:5000/videos");
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div>
      <h2>Recorded Videos</h2>
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <div key={index}>
            <h3>Answer {index + 1}</h3>
            <video controls>
              <source
                src={`http://localhost:5000/uploads/${video}`}
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        ))
      ) : (
        <p>No videos recorded yet.</p>
      )}
    </div>
  );
};

export default VideoList;
