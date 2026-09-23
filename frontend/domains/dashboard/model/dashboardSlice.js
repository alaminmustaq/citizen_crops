import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: [], 
  usersData: [],
  jobPositionData: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },

     setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
     setJobPositionData: (state, action) => {
      state.jobPositionData = action.payload;
    },
  },
});

export const { setDashboardData, setUsersData, setJobPositionData} = dashboardSlice.actions;

export default dashboardSlice.reducer;
