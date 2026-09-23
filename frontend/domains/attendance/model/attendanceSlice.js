import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    todayAttendance: null,
    attendanceHistory: [],
    currentQRCode: null,
    qrStatus: null,
    isCheckedIn: false,
    lastAction: null,
    offlineData: [],
    syncStatus: 'idle', // 'idle' | 'syncing' | 'completed' | 'failed'
    preferences: {
        autoCheckOut: false,
        locationRequired: true,
        notificationsEnabled: true,
    },
};

const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        setTodayAttendance: (state, action) => {
            state.todayAttendance = action.payload;
            state.isCheckedIn = action.payload?.check_in_time && !action.payload?.check_out_time;
        },
        
        setAttendanceHistory: (state, action) => {
            state.attendanceHistory = action.payload;
        },
        
        setCurrentQRCode: (state, action) => {
            state.currentQRCode = action.payload;
        },
        
        setQRStatus: (state, action) => {
            state.qrStatus = action.payload;
        },
        
        addToOfflineData: (state, action) => {
            state.offlineData.push({
                ...action.payload,
                timestamp: new Date().toISOString(),
                id: Date.now() + Math.random(),
            });
        },
        
        clearOfflineData: (state) => {
            state.offlineData = [];
        },
        
        setSyncStatus: (state, action) => {
            state.syncStatus = action.payload;
        },
        
        setLastAction: (state, action) => {
            state.lastAction = {
                action: action.payload.action,
                timestamp: new Date().toISOString(),
                success: action.payload.success,
                data: action.payload.data,
            };
        },
        
        updatePreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        
        checkIn: (state, action) => {
            state.todayAttendance = action.payload;
            state.isCheckedIn = true;
            state.lastAction = {
                action: 'check_in',
                timestamp: new Date().toISOString(),
                success: true,
                data: action.payload,
            };
        },
        
        checkOut: (state, action) => {
            state.todayAttendance = action.payload;
            state.isCheckedIn = false;
            state.lastAction = {
                action: 'check_out',
                timestamp: new Date().toISOString(),
                success: true,
                data: action.payload,
            };
        },
        
        resetAttendanceState: (state) => {
            return { ...initialState, preferences: state.preferences };
        },
        
        updateAttendanceRecord: (state, action) => {
            const { id, ...updates } = action.payload;
            
            // Update today's attendance if it matches
            if (state.todayAttendance?.id === id) {
                state.todayAttendance = { ...state.todayAttendance, ...updates };
            }
            
            // Update in history if it exists
            const historyIndex = state.attendanceHistory.findIndex(record => record.id === id);
            if (historyIndex !== -1) {
                state.attendanceHistory[historyIndex] = { 
                    ...state.attendanceHistory[historyIndex], 
                    ...updates 
                };
            }
        },
        
    },
});

export const {
    setTodayAttendance,
    setAttendanceHistory,
    setCurrentQRCode,
    setQRStatus,
    addToOfflineData,
    clearOfflineData,
    setSyncStatus,
    setLastAction,
    updatePreferences,
    checkIn,
    checkOut,
    resetAttendanceState,
    updateAttendanceRecord,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;