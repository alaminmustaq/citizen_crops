import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const holidayReasonApi = createApi({
  reducerPath: "HolidayReason",
  baseQuery,
  tagTypes: ["HolidayReason"],
  endpoints: (builder) => ({
    fetchHoliday: builder.query({
      query: () => ({
        url: "holiday/holiday_reason",
        params: { ...getFilterParams() },
      }),
      providesTags: ["HolidayReason"],
    }),
    
    createHoliday: builder.mutation({
      query: (data) => ({
        url: "holiday/holiday_reason",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HolidayReason"],
    }),
    updateHoliday: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `holiday/holiday_reason/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HolidayReason"],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: `holiday/holiday_reason/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HolidayReason"],
    }),
  }),
});

export const {
  useFetchHolidayQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
} = holidayReasonApi;
