export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price: number;
  isChecked: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
