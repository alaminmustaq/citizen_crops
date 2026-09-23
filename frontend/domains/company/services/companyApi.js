import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const companyApi = createApi({
    reducerPath: "Company",
    baseQuery: baseQuery,
    tagTypes: ["Company"],
    endpoints: (builder) => ({
        companyCreate: builder.mutation({
            query: (credentials) => ({
                url: "organization/companies",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Company"],
        }),
        companyUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `organization/companies/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Company"],
        }),
        companyDelete: builder.mutation({
            query: ({ id }) => ({
                url: `organization/companies/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Company"],
        }),
        companyFetch: builder.query({
            query: () => ({
                url: "organization/companies",
                method: "GET",
                params: { ...getFilterParams()}, // fetch all companies
            }),
            providesTags: ["Company"],
        }),

        companySearch: builder.query({
            query: ({ search }) => ({
                url: "organization/companies",
                method: "GET",
                params: search ? { search } : undefined, // send as query parameter
            }),
            providesTags: ["Company"], // optional caching
        }),
    }),
});

export const {
    useCompanyCreateMutation,
    useCompanyUpdateMutation,
    useCompanyDeleteMutation,
    useCompanyFetchQuery,
    useCompanySearchQuery,
} = companyApi;
