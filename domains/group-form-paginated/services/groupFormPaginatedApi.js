import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const groupFormPaginatedApi = createApi({
    reducerPath: "group-form-paginated",
    baseQuery: baseQuery,
    tagTypes: ["group-form-paginated"],
    endpoints: (builder) => ({
        loadPaginatedData: builder.query({
            query: ({ url, params }) => ({
                url: url,
                method: "GET",
                params: params,
            }),
            providesTags: ["group-form-paginated"],
        }),
    }),
});

export const { useLoadPaginatedDataQuery, useLazyLoadPaginatedDataQuery } = groupFormPaginatedApi;

