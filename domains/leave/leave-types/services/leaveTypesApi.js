import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const leaveTypesApi = createApi({
  reducerPath: "leave-type",
  baseQuery,
  tagTypes: ["leave-type"],
  endpoints: (builder) => ({
    fetchLeave: builder.query({
      query: ({ params } = {}) => ({
        url: "leave/leave_type",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["leave-type"],
    }),
    
    createLeave: builder.mutation({
      query: (data) => ({
        url: "leave/leave_type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["leave-type"],
    }),
    updateLeave: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leave/leave_type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["leave-type"],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `leave/leave_type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leave-type"],
    }),
  }),
});

export const {
  useFetchLeaveQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leaveTypesApi;
