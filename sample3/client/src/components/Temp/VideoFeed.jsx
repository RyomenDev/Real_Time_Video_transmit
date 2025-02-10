// Handles video streaming.

const VideoFeed = ({ videoRef }) => {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    />
  );
};

export default VideoFeed;
