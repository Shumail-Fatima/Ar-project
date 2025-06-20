import express from 'express';
import upload from '../middleware/upload';
import Model3D from '../models/Model3d';

const router = express.Router();

// Upload a model
router.post('/upload', upload.single('modelFile'), async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const glbUrl = `${req.protocol}://${req.get('host')}/uploads/models/${file.filename}`;

    const newModel = await Model3D.create({ name, category, description, glbUrl });
    res.status(201).json(newModel);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

// Get all models
router.get('/', async (req, res) => {
  try {
    const models = await Model3D.find();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

export default router;