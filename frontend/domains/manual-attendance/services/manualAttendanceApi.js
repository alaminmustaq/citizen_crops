import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../utility/baseQuery";

export const manualAttendanceApi = createApi({
    reducerPath: "manualAttendanceApi",
    baseQuery: baseQuery,
    tagTypes: ["ManualAttendance"],
    endpoints: (builder) => ({
        // Create manual attendance entry
        createManualAttendance: builder.mutation({
            query: (data) => ({
                url: "hrm/manual-attendance",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ManualAttendance"],
        }),

        // Update manual attendance
        updateManualAttendance: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `hrm/manual-attendance/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ManualAttendance"],
        }),

        // Delete manual attendance
        deleteManualAttendance: builder.mutation({
            query: (id) => ({
                url: `hrm/manual-attendance/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ManualAttendance"],
        }),

        // Get all manual attendance records
        fetchManualAttendances: builder.query({
            query: (params = {}) => ({
                url: "hrm/manual-attendance",
                method: "GET",
                params,
            }),
            providesTags: ["ManualAttendance"],
        }),

        // Get single manual attendance by ID
        fetchManualAttendanceById: builder.query({
            query: (id) => ({
                url: `hrm/manual-attendance/${id}`,
                method: "GET",
            }),
            providesTags: ["ManualAttendance"],
        }),

        // Filter employees for manual attendance
        filterEmployeesForAttendance: builder.query({
            query: (filterTerm) => ({
                url: "hrm/filter-employees",
                method: "GET",
                params: { ...filterTerm },
            }),
            providesTags: ["ManualAttendance"],
        }),

   }),
});

export const {
    useCreateManualAttendanceMutation,
    useUpdateManualAttendanceMutation,
    useDeleteManualAttendanceMutation,
    useFetchManualAttendancesQuery,
    useLazyFetchManualAttendancesQuery,
    useFetchManualAttendanceByIdQuery,
    useLazyFilterEmployeesForAttendanceQuery,
} = manualAttendanceApi;
