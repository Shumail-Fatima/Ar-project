import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

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

export default router;
