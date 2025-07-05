import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import Model3D from '../models/Model3D'; // Adjust the import path as necessary

const router = Router();

router.get('/:filename', (req: Request, res: Response): void => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads/markers', filename);
  console.log('Marker request:', filePath);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Marker file not found' });
    return;
  }

  res.sendFile(filePath, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });
});

// Serve marker (.mind) file by targetIndex
router.get('/marker/:targetIndex', async (req, res): Promise<any> => {
  try {
    const model = await Model3D.findOne({ targetIndex: parseInt(req.params.targetIndex) });
    if (!model || !model.markerFile) {
      return res.status(404).send('Marker not found');
    }
    res.set('Content-Type', model.markerMime || 'application/octet-stream');
    res.send(model.markerFile);
  } catch (err) {
    console.error('Serve marker error:', err);
    res.status(500).send('Internal server error');
  }
});

export default router;
