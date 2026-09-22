import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const holidayTypesApi = createApi({
  reducerPath: "holiday-type",
  baseQuery,
  tagTypes: ["holiday-type"],
  endpoints: (builder) => ({
    fetchHoliday: builder.query({
      query: ({ params } = {}) => ({
        url: "holiday/holiday_type",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["holiday-type"],
    }),
    
    createHoliday: builder.mutation({
      query: (data) => ({
        url: "holiday/holiday_type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["holiday-type"],
    }),
    updateHoliday: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `holiday/holiday_type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["holiday-type"],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: `holiday/holiday_type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["holiday-type"],
    }),
  }),
});

export const {
  useFetchHolidayQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
} = holidayTypesApi;
