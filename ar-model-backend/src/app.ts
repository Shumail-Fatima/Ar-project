import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import modelRoutes from './routes/modelRoutes';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import markerRoutes from './routes/markerRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../uploads');
const modelsDir = path.join(uploadsDir, 'models');
const markersDir = path.join(uploadsDir, 'markers');

[uploadsDir, modelsDir, markersDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Add this line to serve /public/js/modelService.js
app.use(express.static(path.join(__dirname, '../public')));
// Serve static files (including index.html)
app.use(express.static(path.join(__dirname, '../')));

// Route to serve the upload form
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/upload.html'));
});

app.use('/api/marker', markerRoutes);

// Serve static files (including index.html)
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/models', modelRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../IndexMain.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AR Model Backend is running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ar-models';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

export default app;