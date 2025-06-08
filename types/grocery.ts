export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price: number;
  isChecked: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchivedList {
  id: string;
  timestamp: string;
  items: GroceryItem[];
}

export interface GroceryState {
  items: GroceryItem[];
  archived: ArchivedList[];
}
