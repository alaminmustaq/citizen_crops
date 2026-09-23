import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const departmentApi = createApi({
    reducerPath: "Department",
    baseQuery: baseQuery,
    tagTypes: ["Department"],
    endpoints: (builder) => ({
        departmentCreate: builder.mutation({
            query: (credentials) => ({
                url: "organization/departments",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Department"],
        }),
        departmentUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `organization/departments/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Department"],
        }),
        departmentDelete: builder.mutation({
            query: ({ id }) => ({
                url: `organization/departments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Department"],
        }),
        departmentFetch: builder.query({
            query: () => ({
                url: "organization/departments",
                method: "GET",
                params: { ...getFilterParams() }, // fetch all branches
            }),
            providesTags: ["Department"],
        }),
        departmentSearch: builder.query({
            query: ({ search }) => ({
                url: "organization/departments",
                method: "GET",
                params: search ? { search } : undefined, // send as query parameter
            }),
            providesTags: ["Department"],
        }),
    }),
});

export const {
    useDepartmentCreateMutation,
    useDepartmentUpdateMutation,
    useDepartmentDeleteMutation,
    useDepartmentSearchQuery,
    useDepartmentFetchQuery,
} = departmentApi;
