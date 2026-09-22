import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const activityApi = createApi({
    reducerPath: "activityApi",
    baseQuery: baseQuery,
    tagTypes: ["Activity"],
    endpoints: (builder) => ({   
        fetchActivity: builder.query({
            query: () => ({
                url: "activity/activity",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            providesTags: ["Activity"],
        }),
    }),
});

export const { 
    useFetchActivityQuery,
} = activityApi;
