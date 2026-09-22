import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const holidayPostingApi = createApi({
  reducerPath: "holiday-posting",
  baseQuery,
  tagTypes: ["holiday-posting"],
  endpoints: (builder) => ({
    fetchHoliday: builder.query({
      query: ({ params } = {}) => ({
        url: "holiday/holiday_posting",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["holiday-posting"],
    }),
    
    createHoliday: builder.mutation({
      query: (data) => ({
        url: "holiday/holiday_posting",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["holiday-posting"],
    }),
    updateHoliday: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `holiday/holiday_posting/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["holiday-posting"],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: `holiday/holiday_posting/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["holiday-posting"],
    }),
    deleteGroupHoliday: builder.mutation({
      query: (data) => ({
        url: `holiday/group_delete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["holiday-posting"],
    }),
    ApproveHoliday: builder.mutation({
      query: (data) => ({
        url: `holiday/approve_holiday`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["holiday-posting"],
    }),

  }),
});

export const {
  useFetchHolidayQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useDeleteGroupHolidayMutation,

  useApproveHolidayMutation,
} = holidayPostingApi;
