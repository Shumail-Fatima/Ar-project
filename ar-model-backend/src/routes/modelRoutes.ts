import express from 'express';
import { uploadCombined } from '../middleware/upload';
import Model3D from '../models/Model3D';
import { IModel3D } from '../models/Model3D';

const router = express.Router();

// Upload a complete model with marker
router.post('/upload', uploadCombined.fields([
  { name: 'modelFile', maxCount: 1 },
  { name: 'markerFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, category, description, position, scale, rotation, targetIndex } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.modelFile || !files.markerFile) {
      res.status(400).json({ 
        error: 'Both model file (.glb/.gltf) and marker file (.mind) are required' 
      });
      return;
    }

    const modelFile = files.modelFile[0];
    const markerFile = files.markerFile[0];

    const modelUrl = `${req.protocol}://${req.get('host')}/uploads/models/${modelFile.filename}`;
    const markerUrl = `${req.protocol}://${req.get('host')}/uploads/markers/${markerFile.filename}`;

    // Parse position, scale, rotation if provided
    const parsedPosition = position ? JSON.parse(position) : { x: 0, y: 0, z: 0 };
    const parsedScale = scale ? JSON.parse(scale) : { x: 1, y: 1, z: 1 };
    const parsedRotation = rotation ? JSON.parse(rotation) : { x: 0, y: 0, z: 0 };

    const newModel = await Model3D.create({
      name,
      category: category || 'other',
      description,
      modelUrl,
      markerUrl,
      position: parsedPosition,
      scale: parsedScale,
      rotation: parsedRotation,
      targetIndex: parseInt(targetIndex) || 0,
      isActive: true
    });

    res.status(201).json(newModel);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error' 
    });
  }
});

// Get all active models
router.get('/', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const filter: any = {};
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const models = await Model3D.find(filter).sort({ createdAt: -1 });
    res.json(models);
  } catch (err) {
    console.error('Fetch models error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error' 
    });
  }
});

// Get a specific model by ID
router.get('/:id', async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);
    if (!model) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }
    res.json(model);
  } catch (err) {
    console.error('Fetch model error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error' 
    });
  }
});

// Update a model
router.put('/:id', async (req, res) => {
  try {
    const { name, category, description, position, scale, rotation, isActive } = req.body;
    
    const updatedModel = await Model3D.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        position,
        scale,
        rotation,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedModel) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }

    res.json(updatedModel);
  } catch (err) {
    console.error('Update model error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error' 
    });
  }
});

// Delete a model
router.delete('/:id', async (req, res) => {
  try {
    const deletedModel = await Model3D.findByIdAndDelete(req.params.id);
    if (!deletedModel) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }
    res.json({ message: 'Model deleted successfully', model: deletedModel });
  } catch (err) {
    console.error('Delete model error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error' 
    });
  }
});

// Get models by category
router.get('/category/:category', async (req, res) => {
  try {
    const models = await Model3D.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ createdAt: -1 });
    res.json(models);
  } catch (err) {
    console.error('Fetch models by category error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error' 
    });
  }
});

// Toggle model active status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);
    if (!model) {
      res.status(404).json({ error: 'Model not found' });
      return;
    }

    model.isActive = !model.isActive;
    await model.save();

    res.json(model);
  } catch (err) {
    console.error('Toggle model error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error' 
    });
  }
});

export default router;