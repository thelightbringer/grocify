import { configureStore } from '@reduxjs/toolkit';
import groceryReducer from './grocerySlice';

export const store = configureStore({
  reducer: {
    grocery: groceryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 