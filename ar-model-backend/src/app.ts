import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import modelRoutes from './routes/modelRoutes';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/models', modelRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the 3D Model API!');
});

// MongoDB Connection
mongoose.connect('mongodb+srv://shumailarshadubit:ZUuvYNvQPITgEDQr@cluster0.n6slpns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Error:', err));