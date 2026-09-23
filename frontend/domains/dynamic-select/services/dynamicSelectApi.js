import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const dynamicSelectApi = createApi({
    reducerPath: "dynamic-select",
    baseQuery: baseQuery,
    tagTypes: ["dynamic-select"],
    endpoints: (builder) => ({
        dynamicSelectSearch: builder.query({
            query: ({ data }) => {
              const { search, url, ...rest } = data; // rest will include company_id etc
              return {
                url,
                method: "GET",
                params: search || Object.keys(rest).length ? { search, ...rest } : undefined,
              };
            },
            providesTags: ["dynamic-select"],
          }),           
    }),
});

export const { useDynamicSelectSearchQuery, useLazyDynamicSelectSearchQuery } = dynamicSelectApi;
