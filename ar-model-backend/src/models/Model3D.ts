import mongoose from 'mongoose';

const model3DSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  glbUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Model3D = mongoose.model('Model3D', model3DSchema);

export default Model3D;
