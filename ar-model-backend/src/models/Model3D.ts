import mongoose, { Document, Schema } from 'mongoose';

export interface IModel3D extends Document {
  name: string;
  category: string;
  description: string;
  modelUrl: string;
  markerUrl: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  targetIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const model3DSchema = new Schema<IModel3D>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['furniture', 'electronics', 'vehicles', 'architecture', 'art', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  modelUrl: {
    type: String,
    required: true
  },
  markerUrl: {
    type: String,
    required: true
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  scale: {
    x: { type: Number, default: 1 },
    y: { type: Number, default: 1 },
    z: { type: Number, default: 1 }
  },
  rotation: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  targetIndex: {
    type: Number,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
model3DSchema.index({ category: 1, isActive: 1 });
//model3DSchema.index({ targetIndex: 1 });

const Model3D = mongoose.model<IModel3D>('Model3D', model3DSchema);

export default Model3D;