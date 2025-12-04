
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  isSidebarOpen: boolean;
  sidebarWidth: number;
  isDarkMode: boolean;
  breadcrumb: string[];
}

const initialState: UiState = {
  isSidebarOpen: true,
  sidebarWidth: 260, // Default expanded width
  isDarkMode: false,
  breadcrumb: ['360° Overview', 'Dashboard'],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setBreadcrumb: (state, action: PayloadAction<string[]>) => {
      state.breadcrumb = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setSidebarWidth, toggleDarkMode, setBreadcrumb } = uiSlice.actions;

export default uiSlice.reducer;
