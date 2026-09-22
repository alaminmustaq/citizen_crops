import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const scheduleSetupApi = createApi({
    reducerPath: "schedule-setup",
    baseQuery,
    tagTypes: ["schedule-setup"],
    endpoints: (builder) => ({
        fetchSchedule: builder.query({
            query: ({ params } = {}) => ({
                url: "schedule/schedule_setup",
                params: { ...getFilterParams(), ...params },
            }),
            providesTags: ["schedule-setup"],
        }),

        createSchedule: builder.mutation({
            query: (data) => ({
                url: "schedule/schedule_setup",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["schedule-setup"],
        }),
        updateSchedule: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `schedule/schedule_setup/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["schedule-setup"],
        }),
        deleteSchedule: builder.mutation({
            query: (id) => ({
                url: `schedule/schedule_setup/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["schedule-setup"],
        }),
        deleteGroupSchedule: builder.mutation({
            query: (data) => ({
                url: `schedule/group_delete`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["schedule-setup"],
        }),
        ApproveSchedule: builder.mutation({
            query: (data) => ({
                url: `schedule/approve_schedule`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["schedule-setup"],
        }),
    }),
});

export const {
    useFetchScheduleQuery,
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
    useDeleteGroupScheduleMutation,

    useApproveScheduleMutation,
} = scheduleSetupApi;
