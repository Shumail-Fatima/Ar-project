export interface Model3D {
  _id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadModelData {
  name: string;
  category: string;
  description: string;
  position?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  targetIndex?: number;
}

class ModelService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl || window.location.origin;
  }

  // Fetch all models
  async getAllModels(category?: string): Promise<Model3D[]> {
    try {
      const url = new URL(`${this.baseUrl}/api/models`);
      if (category) {
        url.searchParams.append('category', category);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

  // Fetch a specific model by ID
  async getModelById(id: string): Promise<Model3D> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching model:', error);
      throw error;
    }
  }

  // Upload a new model with marker
  async uploadModel(
    modelFile: File, 
    markerFile: File, 
    data: UploadModelData
  ): Promise<Model3D> {
    try {
      const formData = new FormData();
      formData.append('modelFile', modelFile);
      formData.append('markerFile', markerFile);
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('description', data.description);
      
      if (data.position) {
        formData.append('position', JSON.stringify(data.position));
      }
      if (data.scale) {
        formData.append('scale', JSON.stringify(data.scale));
      }
      if (data.rotation) {
        formData.append('rotation', JSON.stringify(data.rotation));
      }
      if (data.targetIndex !== undefined) {
        formData.append('targetIndex', data.targetIndex.toString());
      }

      const response = await fetch(`${this.baseUrl}/api/models/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading model:', error);
      throw error;
    }
  }

  // Update a model
  async updateModel(id: string, data: Partial<Model3D>): Promise<Model3D> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to update model: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  }

  // Delete a model
  async deleteModel(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  }

  // Fetch models by category
  async getModelsByCategory(category: string): Promise<Model3D[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models/category/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models by category: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching models by category:', error);
      throw error;
    }
  }

  // Toggle model active status
  async toggleModelStatus(id: string): Promise<Model3D> {
    try {
      const response = await fetch(`${this.baseUrl}/api/models/${id}/toggle`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle model status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling model status:', error);
      throw error;
    }
  }

  // Check server health
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const modelService = new ModelService();
export default ModelService;