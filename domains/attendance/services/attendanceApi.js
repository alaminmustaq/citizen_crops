import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../utility/baseQuery";

import { getFilterParams } from "@/utility/helpers";
export const attendanceApi = createApi({
    reducerPath: "attendanceApi",
    baseQuery: baseQuery,
    tagTypes: ["Attendance", "AttendanceRequest", "QRCode"],
    endpoints: (builder) => ({
        // QR Code operations
        generateQRCode: builder.mutation({
            query: ({ branchId, expiresInMinutes = 30 }) => ({
                url: "hrm/attendance/qr/generate",
                method: "POST",
                body: {
                    branch_id: branchId,
                    expires_in_minutes: expiresInMinutes,
                },
            }),
            invalidatesTags: ["QRCode"],
        }),

        scanQRCode: builder.mutation({
            query: ({
                qrToken,
                action,
                latitude,
                longitude,
                deviceInfo,
                breakReason,
            }) => ({
                url: "hrm/qr/scan",
                method: "POST",
                body: {
                    qr_token: qrToken,
                    action: action,
                    latitude: latitude,
                    longitude: longitude,
                    break_reason: breakReason,
                },
            }),
            invalidatesTags: ["Attendance"],
        }),

        getQRStatus: builder.query({
            query: (branchId) => ({
                url: `hrm/attendance/qr/status?branch_id=${branchId}`,
                method: "GET",
            }),
            providesTags: ["QRCode"],
        }),

        refreshQRCode: builder.mutation({
            query: (branchId) => ({
                url: "hrm/attendance/qr/refresh",
                method: "POST",
                body: { branch_id: branchId },
            }),
            invalidatesTags: ["QRCode"],
        }),

        // Standard attendance operations
        checkIn: builder.mutation({
            query: (data) => ({
                url: "hrm/attendance/check-in",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Attendance"],
        }),

        checkOut: builder.mutation({
            query: (data) => ({
                url: "hrm/attendance/check-out",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Attendance"],
        }),

        requestAttendance: builder.mutation({
            query: (data) => ({
                url: "hrm/attendance/request",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["AttendanceRequest"],
        }),

        viewAttendanceRequests: builder.query({
            query: () => ({
                url: "hrm/attendance/requests",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            keepUnusedDataFor: 0,
            refetchOnMountOrArgChange: true,
            providesTags: ["AttendanceRequest"],
        }),

        updateAttendanceRequest: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `hrm/attendance/requests/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["AttendanceRequest"],
        }),

        approveAttendanceRequest: builder.mutation({
            query: (id) => ({
                url: `hrm/attendance/requests/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["AttendanceRequest", "Attendance"],
        }),

        rejectAttendanceRequest: builder.mutation({
            query: (id) => ({
                url: `hrm/attendance/requests/${id}/reject`,
                method: "PATCH",
            }),
            invalidatesTags: ["AttendanceRequest"],
        }),

        getTodayAttendance: builder.query({
            query: () => ({
                url: "hrm/attendance/today",
                method: "GET",
            }),
            providesTags: ["Attendance"],
        }),

        getBreakStatus: builder.query({
            query: () => ({
                url: "hrm/attendance/break-status",
                method: "GET",
            }),
            providesTags: ["Attendance"],
        }),

        getBreakList: builder.query({
            query: () => ({
                url: "hrm/attendance/break-list",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            keepUnusedDataFor: 0,
            refetchOnMountOrArgChange: true,
            providesTags: ["Attendance"],
        }),

        getActiveBreaks: builder.query({
            query: () => ({
                url: "hrm/attendance/active-breaks",
                method: "GET",
            }),
            keepUnusedDataFor: 0,
            refetchOnMountOrArgChange: true,
            providesTags: ["Attendance"],
        }),

        getTodayAbsent: builder.query({
            query: () => ({
                url: "hrm/attendance/today-absent",
                method: "GET",
            }),
            keepUnusedDataFor: 0,
            refetchOnMountOrArgChange: true,
            providesTags: ["Attendance"],
        }),

        updateBreakApprovalStatus: builder.mutation({
            query: ({ id, approval_status, attendance_ids }) => ({
                url: `hrm/attendance/${id}/break-status`,
                method: "PATCH",
                body: { approval_status, attendance_ids },
            }),
            invalidatesTags: ["Attendance"],
        }),

        viewAttendance: builder.query({
            query: () => ({
                url: "hrm/attendance",
                method: "GET",
                params: { ...getFilterParams() },
            }),

            keepUnusedDataFor: 0,
            refetchOnMountOrArgChange: true,
            providesTags: ["Attendance"],
        }),

        getAttendanceHistory: builder.query({
            query: (params = {}) => ({
                url: "hrm/attendance",
                method: "GET",
                params,
            }),
            providesTags: ["Attendance"],
        }),

        manualEntry: builder.mutation({
            query: (data) => ({
                url: "hrm/attendance/manual-entry",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Attendance"],
        }),

        syncOfflineData: builder.mutation({
            query: (offlineData) => ({
                url: "hrm/attendance/sync-offline",
                method: "POST",
                body: { offline_data: offlineData },
            }),
            invalidatesTags: ["Attendance"],
        }),

        getAttendanceReport: builder.query({
            query: (params) => ({
                url: "hrm/attendance/report",
                method: "GET",
                params,
            }),
        }),

        deleteAttendance: builder.mutation({
            query: (id) => ({
                url: `hrm/attendance/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Attendance"],
        }),

        updateAttendance: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `hrm/attendance/${id}`,
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
    useGetBreakStatusQuery,
    useLazyGetBreakStatusQuery,
    useGetBreakListQuery,
    useGetActiveBreaksQuery,
    useGetTodayAbsentQuery,
    useUpdateBreakApprovalStatusMutation,
    useGetAttendanceHistoryQuery,
    useLazyGetAttendanceHistoryQuery,
    useManualEntryMutation,
    useSyncOfflineDataMutation,
    useRequestAttendanceMutation,
    useViewAttendanceRequestsQuery,
    useUpdateAttendanceRequestMutation,
    useApproveAttendanceRequestMutation,
    useRejectAttendanceRequestMutation,
    useGetAttendanceReportQuery,
    useLazyGetAttendanceReportQuery,
    useDeleteAttendanceMutation,
    useUpdateAttendanceMutation,
    useViewAttendanceQuery,
    useLazyGetLatestBranchLocationQuery,
} = attendanceApi;
