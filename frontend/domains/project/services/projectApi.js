import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const projectApi = createApi({
    reducerPath: "Project",
    baseQuery: baseQuery, // make sure baseQuery's baseUrl is http://localhost:8000/api/v1/
    tagTypes: ["Project"],
    endpoints: (builder) => ({
        getProject: builder.query({
            query: ({ id = false }) => ({
                url: "projects",
                method: "GET",
                params: id ? { id } : getFilterParams(),
            }),
            providesTags: ["Project"],
        }),



        projectCreate: builder.mutation({
            query: (credentials) => ({
                url: "projects",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Project"],
        }),
        projectUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `projects/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Project"],
        }),
        projectDelete: builder.mutation({
            query: ({ id }) => ({
                url: `projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"],
        }),
        projectFetch: builder.query({
            query: ({ id } = {}) => {
        
                return {
                    url: "projects",
                    method: "GET",
                    params: id
                        ? { ...getFilterParams(), id }
                        : { ...getFilterParams() },
                };
            },
            providesTags: ["Project"],
        }),

        projectSearch: builder.query({
            query: ({ search }) => ({
                url: "projects",
                method: "GET",
                params: search ? { search } : undefined,
            }),
            providesTags: ["Project"],
        }),
        projectGetById: builder.query({
            query: (id) => ({
                url: `projects/${id}`,
                method: "GET",
            }),
            providesTags: ["Project"],
        }),
        projectUpdateAssignedEmployees: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `projects/${id}/assigned-employees`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Project"],
        }),
    }),
});

export const {
  useProjectCreateMutation,
  useProjectUpdateMutation,
  useProjectDeleteMutation,
  useProjectSearchQuery,
  useProjectFetchQuery,
  useProjectGetByIdQuery,
  useProjectUpdateAssignedEmployeesMutation,
  useLazyProjectFetchQuery
} = projectApi;
