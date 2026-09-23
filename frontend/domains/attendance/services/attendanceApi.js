import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../utility/baseQuery";

export const attendanceApi = createApi({
    reducerPath: "attendanceApi",
    baseQuery: baseQuery,
    tagTypes: ["Attendance", "QRCode"],
    endpoints: (builder) => ({
        // QR Code operations
        generateQRCode: builder.mutation({
            query: ({ branchId, expiresInMinutes = 30 }) => ({
                url: "api/v1/hrm/attendance/qr/generate",
                method: "POST",
                body: {
                    branch_id: branchId,
                    expires_in_minutes: expiresInMinutes,
                },
            }),
            invalidatesTags: ["QRCode"],
        }),

        scanQRCode: builder.mutation({
            query: ({ qrToken, action, latitude, longitude, deviceInfo }) => ({
                url: "hrm/qr/scan",
                method: "POST",
                body: {
                    qr_token: qrToken,
                    action: action,
                    latitude: latitude,
                    longitude: longitude,
                },
            }),
            invalidatesTags: ["Attendance"],
        }),

        getQRStatus: builder.query({
            query: (branchId) => ({
                url: `api/v1/hrm/attendance/qr/status?branch_id=${branchId}`,
                method: "GET",
            }),
            providesTags: ["QRCode"],
        }),

        refreshQRCode: builder.mutation({
            query: (branchId) => ({
                url: "api/v1/hrm/attendance/qr/refresh",
                method: "POST",
                body: { branch_id: branchId },
            }),
            invalidatesTags: ["QRCode"],
        }),

        // Standard attendance operations
        checkIn: builder.mutation({
            query: (data) => ({
                url: "api/v1/hrm/attendance/check-in",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Attendance"],
        }),

        checkOut: builder.mutation({
            query: (data) => ({
                url: "api/v1/hrm/attendance/check-out",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Attendance"],
        }),

        getTodayAttendance: builder.query({
            query: () => ({
                url: "api/v1/hrm/attendance/today",
                method: "GET",
            }),
            providesTags: ["Attendance"],
        }),

        viewAttendance: builder.query({
            query: () => ({
                url: "hrm/attendance",
                method: "GET",
            }),
            providesTags: ["Attendance"],
        }),
        getAttendanceHistory: builder.query({
            query: (params = {}) => ({
                url: "api/v1/hrm/attendance",
                method: "GET",
                params,
            }),
            providesTags: ["Attendance"],
        }),

        manualEntry: builder.mutation({
            query: (data) => ({
                url: "api/v1/hrm/attendance/manual-entry",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Attendance"],
        }),

        syncOfflineData: builder.mutation({
            query: (offlineData) => ({
                url: "api/v1/hrm/attendance/sync-offline",
                method: "POST",
                body: { offline_data: offlineData },
            }),
            invalidatesTags: ["Attendance"],
        }),

        getAttendanceReport: builder.query({
            query: (params) => ({
                url: "api/v1/hrm/attendance/report",
                method: "GET",
                params,
            }),
        }),

        deleteAttendance: builder.mutation({
            query: (id) => ({
                url: `api/v1/hrm/attendance/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Attendance"],
        }),

        updateAttendance: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `api/v1/hrm/attendance/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Attendance"],
        }),
        // getLatestBranchLocation: builder.mutation({
        //     query: () => ({
        //         url: `api/latest-branch-location`,
        //         method: "GET", 
        //     }), 
        //     invalidatesTags: ["Latest"],
        // }),
         getLatestBranchLocation: builder.query({
            query: () => ({
                url: `hrm/get-branch-location `,
                method: "GET",
            }),
            providesTags: ["Attendance"],
        }),
    }),
});

export const {
    // QR Code hooks
    useGenerateQRCodeMutation,
    useScanQRCodeMutation,
    useGetQRStatusQuery,
    useLazyGetQRStatusQuery,
    useRefreshQRCodeMutation,

    // Standard attendance hooks
    useCheckInMutation,
    useCheckOutMutation,
    useGetTodayAttendanceQuery,
    useLazyGetTodayAttendanceQuery,
    useGetAttendanceHistoryQuery,
    useLazyGetAttendanceHistoryQuery,
    useManualEntryMutation,
    useSyncOfflineDataMutation,
    useGetAttendanceReportQuery,
    useLazyGetAttendanceReportQuery,
    useDeleteAttendanceMutation,
    useUpdateAttendanceMutation,
    useViewAttendanceQuery,
    useLazyGetLatestBranchLocationQuery,
} = attendanceApi;
