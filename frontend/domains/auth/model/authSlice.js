import { createSlice } from "@reduxjs/toolkit";

// Safely get token from localStorage (client-side only)
const getTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const token = getTokenFromStorage();

const initialState = {
  user: null,
  token: token || null,
  isAuthenticated: !!token,
  permissions: [],
  notificationData: [],
  branch: null,
  translation: null,
  language_code: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, notificationData,branch,translation,language_code } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.notificationData = notificationData;
      state.branch = branch;
      state.translation = translation;
      state.language_code = language_code;
      
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Safely remove token from localStorage (client-side only)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }

    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    }
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
