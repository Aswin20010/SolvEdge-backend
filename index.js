require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(express.json());

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'session_snapshots', // optional: Cloudinary folder name
    allowed_formats: ['jpg', 'png'],
    public_id: (req, file) => `snapshot_${Date.now()}`
  }
});
const upload = multer({ storage });

// Setup DB connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// GET /session-logs?session_id=XYZ
app.get('/session-logs', async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    const result = await pool.query(
      'SELECT * FROM elbow_logs WHERE session_id = $1',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).send('Server error');
  }
});

// POST /log-snapshot (form-data with optional image file)
app.post('/log-snapshot', upload.single('snapshot'), async (req, res) => {
  try {
    const { joint, target_angle, time_taken_ms, session_id } = req.body;
    let snapshotPath = null;

    if (req.file && req.file.path) {
      snapshotPath = req.file.path; // Cloudinary URL
    }

    console.log('Received:', { joint, target_angle, time_taken_ms, session_id, snapshotPath });

    const query = `
      INSERT INTO elbow_logs (joint, target_angle, time_taken_ms, session_id, snapshot_path)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [joint, target_angle, time_taken_ms, session_id, snapshotPath]);

    res.status(200).send('Snapshot logged' + (snapshotPath ? ' with image' : ''));
  } catch (err) {
    console.error('Error logging snapshot:', err);
    res.status(500).send('Server error');
  }
});

// Start server
const PORT = process.env.PORT || 3065;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
