import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/models/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

import { Request } from 'express';
import { FileFilterCallback } from 'multer';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.glb', '.gltf'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb and .gltf files allowed'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
