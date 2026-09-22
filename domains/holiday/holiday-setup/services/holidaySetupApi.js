import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const holidaySetupApi = createApi({
  reducerPath: "HolidaySetup",
  baseQuery,
  tagTypes: ["HolidaySetup"],
  endpoints: (builder) => ({
    fetchHoliday: builder.query({
      query: () => ({
        url: "holiday/holiday_setup",
        params: { ...getFilterParams() },
      }),
      providesTags: ["HolidaySetup"],
    }),
    
    createHoliday: builder.mutation({
      query: (data) => ({
        url: "holiday/holiday_setup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HolidaySetup"],
    }),
    updateHoliday: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `holiday/holiday_setup/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HolidaySetup"],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: `holiday/holiday_setup/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HolidaySetup"],
    }),
  }),
});

export const {
  useFetchHolidayQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
} = holidaySetupApi;
