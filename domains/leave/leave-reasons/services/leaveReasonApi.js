import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const leaveReasonApi = createApi({
  reducerPath: "LeaveReason",
  baseQuery,
  tagTypes: ["LeaveReason"],
  endpoints: (builder) => ({
    fetchLeave: builder.query({
      query: () => ({
        url: "leave/leave_reason",
        params: { ...getFilterParams() },
      }),
      providesTags: ["LeaveReason"],
    }),
    
    createLeave: builder.mutation({
      query: (data) => ({
        url: "leave/leave_reason",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveReason"],
    }),
    updateLeave: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leave/leave_reason/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeaveReason"],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `leave/leave_reason/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveReason"],
    }),
  }),
});

export const {
  useFetchLeaveQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leaveReasonApi;
