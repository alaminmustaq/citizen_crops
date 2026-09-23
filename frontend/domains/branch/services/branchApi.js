import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const branchApi = createApi({
    reducerPath: "Branch",
    baseQuery: baseQuery,
    tagTypes: ["Branch"],
    endpoints: (builder) => ({
        branchCreate: builder.mutation({
            query: (credentials) => ({
                url: "organization/branches",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Branch"],
        }),
        branchUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `organization/branches/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Branch"],
        }),
        branchDelete: builder.mutation({
            query: ({ id }) => ({
                url: `organization/branches/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Branch"],
        }),
        branchFetch: builder.query({
            query: () => ({
                url: "organization/branches",
                method: "GET",
                params: { ...getFilterParams() }, // fetch all branches
            }),
            providesTags: ["Branch"],
        }),
        branchSearch: builder.query({
            query: ({ search }) => ({
                url: "organization/branches",
                method: "GET",
                params: search ? { search } : undefined, // send as query parameter
            }),
            providesTags: ["Branch"],
        }),
    }),
});

export const {
    useBranchCreateMutation,
    useBranchUpdateMutation,
    useBranchDeleteMutation,
    useBranchFetchQuery,
    useBranchSearchQuery,
} = branchApi;
