## ✅ Features
- Fetch dummy questions from api.jsx
- Display one question at a time
- Allow predefined answer time (e.g., 2 min, 3 min)
- Countdown timer for each question
- Record user's video for each question separately
- Upload videos to server with metadata (e.g., question number, text)
- Show progress (answered/skipped questions count)
- Skip question option

## 📁 Steps to Implement
- Create API (api.jsx) → Fetch questions
- Design the Video Recording UI
- Implement Timer & Question Flow
- Record & Upload Videos to Server

### Video Interview Component (VideoInterview.jsx) with these features:
✅ Fetches questions from api.jsx
✅ Displays one question at a time
✅ 2-minute countdown timer for answers
✅ Records and uploads videos to the server
✅ Allows skipping questions

#### need to:
1️⃣ Set up api.jsx to provide dummy questions
2️⃣ Ensure your backend (server.js) can handle video uploads

### How to Run the Project
1️⃣ Start Backend
Run in the terminal:

```bash
node server.js
```
2️⃣ Start Frontend
Run in the terminal:
```bash
npm start
```
3️⃣ Open http://localhost:3000 in your browser.

### Features Implemented
✅ Fetches questions dynamically
✅ Countdown timer (2 minutes)
✅ Records and saves answers for each question
✅ Uploads video answers to the backend
✅ Handles network failures
✅ Displays recorded answers

