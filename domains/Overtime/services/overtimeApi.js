
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const overtimeApi = createApi({
  reducerPath: "overtime",
  baseQuery,
  tagTypes: ["Overtime"],
  endpoints: (builder) => ({
    fetchOvertime: builder.query({
      query: (params) => ({
        url: "hrm/overtime",
        method: "GET",
        params: params,
      }),
      providesTags: ["Overtime"],
    }),
    createOvertime: builder.mutation({
      query: (payload) => ({
        url: "hrm/overtime",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Overtime"],
    }),
    updateOvertime: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `hrm/overtime/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Overtime"],
    }),
    deleteOvertime: builder.mutation({
      query: (id) => ({
        url: `hrm/overtime/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Overtime"],
    }),
  }),
});

export const {
  useFetchOvertimeQuery,
  useCreateOvertimeMutation,
  useUpdateOvertimeMutation,
  useDeleteOvertimeMutation,
} = overtimeApi;
