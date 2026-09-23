import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const jobPositionApi = createApi({
    reducerPath: "Job-position",
    baseQuery: baseQuery,
    tagTypes: ["Job-position"],
    endpoints: (builder) => ({
        jobPositionCreate: builder.mutation({
            query: (credentials) => ({
                url: "organization/job-positions",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Job-position"],
        }),
        jobPositionUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `organization/job-positions/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Job-position"],
        }),
        jobPositionDelete: builder.mutation({
            query: ({ id }) => ({
                url: `organization/job-positions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Job-position"],
        }),
        jobPositionFetch: builder.query({
            query: () => ({
                url: "organization/job-positions",
                method: "GET",
                params: { ...getFilterParams() }, // fetch all job positons
            }),
            providesTags: ["Job-position"],
        }),
        jobPositionSearch: builder.query({
            query: ({ search }) => ({
                url: "organization/job-positions",
                method: "GET",
                params: search ? { search } : undefined, // send as query parameter
            }),
            providesTags: ["Job-position"],
        }),
    }),
});

export const {
    useJobPositionCreateMutation,
    useJobPositionUpdateMutation,
    useJobPositionDeleteMutation,
    useJobPositionFetchQuery,
    useJobPositionSearchQuery,
} = jobPositionApi;
