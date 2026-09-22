import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    documentData: {},      // single document object
    currentDocument: null, // optional for current editing document
};

export const documentSlice = createSlice({
    name: "document",
    initialState,
    reducers: {
        setDocumentData: (state, action) => {
            state.documentData = action.payload; // object
        },
        setCurrentDocument: (state, action) => {
            state.currentDocument = action.payload;
        },
    },
});

export const { setDocumentData, setCurrentDocument } = documentSlice.actions;

export default documentSlice.reducer;
