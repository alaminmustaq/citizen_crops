// src/domains/dashboard/services/dashboardApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const dashboardApi = createApi({
  reducerPath: "Dashboard",
  baseQuery: baseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    dashboardFetch: builder.query({
      query: () => ({
        url: "dashboard/dashboard", 
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useDashboardFetchQuery } = dashboardApi;
