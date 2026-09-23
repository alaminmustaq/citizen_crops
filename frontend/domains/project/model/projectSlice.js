import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   projectData : [],
};

export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProjectData: (state, action) => {
            state.projectData = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setProjectData } = projectSlice.actions;

export default projectSlice.reducer;
