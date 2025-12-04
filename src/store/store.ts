
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import inventoryReducer from './inventorySlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Expose store on window in development for easier debugging (inspect via console)
if (import.meta.env && import.meta.env.DEV) {
  try {
    (window as any).__APP_STORE__ = store;
  } catch (_) {}
}
