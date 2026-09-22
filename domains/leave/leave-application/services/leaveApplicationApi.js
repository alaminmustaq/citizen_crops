import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const leaveApplicationApi = createApi({
  reducerPath: "leave-application",
  baseQuery,
  tagTypes: ["leave-application"],
  endpoints: (builder) => ({
    fetchLeave: builder.query({
      query: ({ params } = {}) => ({
        url: "leave/leave_application",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["leave-application"],
    }),
    
    createLeave: builder.mutation({
      query: (data) => ({
        url: "leave/leave_application",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["leave-application"],
    }),
    updateLeave: builder.mutation({
      query: ({ id, ...data }) => {
        const body = data.body || data;
        const isFormData = body instanceof FormData;

        if (isFormData) body.append("_method", "PUT");

        return {
          url: `leave/leave_application/${id}`,
          method: isFormData ? "POST" : "PUT",
          body,
        };
      },
      invalidatesTags: ["leave-application"],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `leave/leave_application/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leave-application"],
    }),
    deleteGroupLeave: builder.mutation({
      query: (data) => ({
        url: `leave/group_delete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["leave-application"],
    }),
    ApproveLeave: builder.mutation({
      query: (data) => ({
        url: `leave/approve_leave`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["leave-application"],
    }),

  }),
});

export const {
  useFetchLeaveQuery,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
  useDeleteGroupLeaveMutation,

  useApproveLeaveMutation,
} = leaveApplicationApi;
