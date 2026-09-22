import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null, // <-- make sure this matches your hook
};

export const profileSlice = createSlice({
    name: "profileData",
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
    },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
