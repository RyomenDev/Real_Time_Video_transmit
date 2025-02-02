Here's a complete MERN stack solution for recording, uploading, storing, and fetching videos from the backend.

## ✅ Features:
Record video using MediaRecorder
Save locally in IndexedDB if offline
Upload to Node.js + Express backend using Multer
Store videos in a local uploads/ folder
Fetch and play videos from the backend
## 🚀 1. Backend (Node.js + Express + Multer)
### 📌 Features:

Upload videos using Multer
Serve videos via API (/videos)
Stream videos on demand (/watch/:filename)
**📁 Backend Code (server/index.js)**



## 🎥 2. Frontend (React)
### 📌 Features:

Request camera and microphone permission
Record and stop video
Upload video to the backend
List and play videos from the backend
**📁 Frontend Code (src/VideoRecorder.jsx)**

## 📌 How to Run the Project
### 🔹 Backend Setup
Install dependencies:
```bash
npm install express multer cors fs path
```
Start the server:
```bash
node index.js
```
### 🔹 Frontend Setup
Install dependencies:
```bash
npm install axios
```
Run React app:
```bash
npm start
```
## 🎯 Final Output
✅ Record video
✅ Upload video to the backend
✅ Fetch and play uploaded videos
✅ Handle network failure (store in IndexedDB)
