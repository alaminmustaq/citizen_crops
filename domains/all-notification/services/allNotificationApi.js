import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const allNotificationApi = createApi({
  reducerPath: "AllNotification",
  baseQuery,
  tagTypes: ["AllNotification"],
  endpoints: (builder) => ({
    fetchNotification: builder.query({
      query: () => ({
        url: "notifications/all-notification",
        params: { ...getFilterParams() },
      }),
      providesTags: ["AllNotification"],
    }),
  }),
});

export const {
  useFetchNotificationQuery,
} = allNotificationApi;
