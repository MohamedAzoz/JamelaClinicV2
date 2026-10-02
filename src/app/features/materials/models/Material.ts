export interface Material {
  id: number;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
}

export interface CreateMaterial {
  name: string;
  price: number;
  description: string;
  isActive: boolean;
}
