import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArchivedList, GroceryItem, GroceryState } from '../../types/grocery';

const initialState: GroceryState = {
  items: [],
  archived: [],
};

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    addItems: (state: GroceryState, action: PayloadAction<string[]>) => {
      const now = new Date().toISOString();
      const newItems: GroceryItem[] = action.payload.map((name: string) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name,
        isChecked: false,
        quantity: 1,
        unit: 'piece',
        category: 'uncategorized',
        price: 0,
        notes: '',
        createdAt: now,
        updatedAt: now,
      }));
      state.items.push(...newItems);
    },
    toggleItem: (state: GroceryState, action: PayloadAction<string>) => {
      const item = state.items.find((i: GroceryItem) => i.id === action.payload);
      if (item) {
        item.isChecked = !item.isChecked;
        item.updatedAt = new Date().toISOString();
      }
    },
    removeItem: (state: GroceryState, action: PayloadAction<string>) => {
      state.items = state.items.filter((i: GroceryItem) => i.id !== action.payload);
    },
    markAllPurchased: (state: GroceryState) => {
      const now = new Date().toISOString();
      state.items.forEach((i: GroceryItem) => {
        i.isChecked = true;
        i.updatedAt = now;
      });
    },
    archivePurchasedItems: (state: GroceryState) => {
      const purchased = state.items.filter((i: GroceryItem) => i.isChecked);
      if (purchased.length === 0) return;
      const archive: ArchivedList = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        items: purchased,
      };
      state.archived.unshift(archive);
      state.items = state.items.filter((i: GroceryItem) => !i.isChecked);
    },
    clearItems: (state: GroceryState) => {
      state.items = [];
    },
  },
});

export const {
  addItems,
  toggleItem,
  removeItem,
  markAllPurchased,
  archivePurchasedItems,
  clearItems,
} = grocerySlice.actions;

export default grocerySlice.reducer; 