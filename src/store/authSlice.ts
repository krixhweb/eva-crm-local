
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  currentUser: User;
}

const initialState: AuthState = {
  // Mocked logged-in user
  currentUser: {
    id: "u_001",
    name: "Sai Krishnan",
    email: "sai@example.com",
    avatar: "SK"
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    // Future: login, logout reducers
  },
});

export const { setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
