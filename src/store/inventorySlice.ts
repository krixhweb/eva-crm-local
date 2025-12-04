
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types';
import { mockProducts } from '../data/inventoryMockData';

interface InventoryState {
  products: Product[];
}

const initialState: InventoryState = {
  products: mockProducts,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    }
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = inventorySlice.actions;
export default inventorySlice.reducer;
