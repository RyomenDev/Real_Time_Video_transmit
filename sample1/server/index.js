const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage for Local Filesystem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Upload Video Route
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ message: "Video uploaded successfully", file: req.file });
});

// ✅ Get List of Uploaded Videos
app.get("/videos", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read directory" });
    res.json(files.map((file) => ({ filename: file, url: `/watch/${file}` })));
  });
});

// ✅ Stream Video on Demand
app.get("/watch/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "File not found" });

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    "Content-Type": "video/webm",
    "Content-Length": stat.size,
  });

  fs.createReadStream(filePath).pipe(res);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
