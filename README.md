# SolvEdge App

PoseTrack is an Android application that uses real-time camera input and machine learning to track elbow movement for physiotherapy exercises. The app leverages **MediaPipe Pose**, **CameraX**, and a custom **Node.js + PostgreSQL backend** to log session data with angle-specific image snapshots and time tracking.

## Key Features

- **Elbow Pose Detection** (left/right) using MediaPipe's heavy model
- **Live Angle Tracking** with overlay visualization
- **Automatic Snapshot Capture** at 135°, 90°, and 45°
- **Time Taken Logging** for each target angle
- **Video Recording** of each session
- **Session Summary Screen** with video and snapshot cards
- **Cloudinary Upload** for snapshot images
- **Backend Integration** (Node.js + PostgreSQL on Render)

---

## How It Works

1. Launch the app and tap **Start Session**.
2. Choose which joints (elbows) you want to track.
3. The app detects pose in real-time, captures snapshot when a target angle is reached.
4. Once done, click **End Session** to stop recording and upload logs.
5. View session data (video, joint angle, time, snapshot) on a summary screen.

---

## 🛠 Tech Stack

### Android (Frontend)
- **Kotlin**, **CameraX**, **MediaPipe PoseLandmarker**
- Custom overlay (`PoseOverlayView`)
- Session logging via **OkHttp**
- UI built with **ConstraintLayout**, **CardView**, and **RecyclerView**

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** (via Render.com)
- Image upload to **Cloudinary**
- REST APIs: `/log-snapshot`, `/session-logs?session_id=`

---

## 🚀 Project Setup

### Prerequisites

- Android Studio Giraffe or later
- Android device with camera access
- Backend deployed to Render (see [Backend Repo](#))

### Clone & Run
```bash
git clone https://github.com/your-username/pose-track-android.git
