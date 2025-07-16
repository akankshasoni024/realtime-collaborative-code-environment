### Live Code Canvas - Realtime Collaborative Code Environment

A real-time collaborative coding platform that allows multiple users to write, edit, and view code simultaneously. Built using **React**, **CodeMirror**, **Socket.io**, and **Node.js**, this environment supports live code editing, customizable themes, and an intuitive user interface — perfect for interviews, coding sessions, or pair programming.

### Features

*  **Real-Time Collaboration** — Multiple users can code together live.
*  **Dark & Light Theme Support** — Switch between themes like `base16-dark`(Dark) and `base16-light`(Light).
*  **Code Editor** — Powered by [CodeMirror 6](https://codemirror.net/), supporting syntax highlighting and modern editing.
*  **Room-Based Sessions** — Unique room IDs allow users to join a collaborative session.
*  **WebSocket Integration** — Uses Socket.io for real-time synchronization.
*  **Join/Leave Room Functionality** — Clear and user-friendly interface for joining or leaving rooms.
*  **Random Avatar Sketches** — Displays user avatars without relying on gender or profile images.

### Tech Stack

## **Frontend**:
* React
* React Router DOM – for routing (BrowserRouter, Routes, Route)
* UUID v4 – to create unique room/user IDs
* CodeMirror 6 – syntax-highlighted code editor
* React Hot Toast – for popup notifications
* React Avatar – for generating user avatars

## **Backend**:
* Node.js
* Express – lightweight backend server
* Socket.IO – real-time bi-directional communication
* Socket.IO-Client – frontend integration for real-time features

### Installation

```bash
git clone https://github.com/yourusername/realtime-code-editor.git
cd realtime-code-editor
npm install
```

#### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
```

---

### Running the App

```bash
# Start server
npm run server

# Start client
npm start
```

---

###  Future Improvements

* 💡 Language support toggle (JavaScript, Python, etc.)
* 💾 Code save/download feature
* 🔐 Authentication & user roles
* 📤 Deployment on Vercel/Render/Netlify + backend on Railway or similar


###  Author

Made by [Akanksha Soni](https://linkedin.com/akankshasoni024)

