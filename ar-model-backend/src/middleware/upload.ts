import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

// Storage configuration for model files
const modelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/models/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `model-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for marker files
const markerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/markers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `marker-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for model files
const modelFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.glb', '.gltf'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb and .gltf model files are allowed'));
  }
};

// File filter for marker files
const markerFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.mind') {
    cb(null, true);
  } else {
    cb(new Error('Only .mind marker files are allowed'));
  }
};

// Combined file filter for both types
const combinedFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.glb', '.gltf', '.mind'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .glb, .gltf, and .mind files are allowed'));
  }
};

// Upload configurations
export const uploadModel = multer({ 
  storage: modelStorage, 
  fileFilter: modelFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export const uploadMarker = multer({ 
  storage: markerStorage, 
  fileFilter: markerFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Combined upload for both model and marker
export const uploadCombined = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.glb', '.gltf'].includes(ext)) {
        cb(null, 'uploads/models/');
      } else if (ext === '.mind') {
        cb(null, 'uploads/markers/');
      } else {
        cb(new Error('Invalid file type'), '');
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname).toLowerCase();
      const prefix = ['.glb', '.gltf'].includes(ext) ? 'model' : 'marker';
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    }
  }),
  fileFilter: combinedFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default uploadCombined;