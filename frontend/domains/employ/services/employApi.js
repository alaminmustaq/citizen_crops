import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const employApi = createApi({
    reducerPath: "Employ",
    baseQuery: baseQuery,
    tagTypes: ["Employ"],
    endpoints: (builder) => ({
        // Fetch employee optionally by ID
        getEmploy: builder.query({
    query: ({ id = false }) => ({
        url: "hrm/employees",
        method: "GET",
        params: id ? { id } : getFilterParams(),
    }),
    providesTags: ["Employ"],
}),


        // Create employee
        employCreate: builder.mutation({
            query: (credentials) => ({
                url: "hrm/employees",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Employ"],
        }),

        // Update employee
        employUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `hrm/employees/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Employ"],
        }),

        // Delete employee
        employDelete: builder.mutation({
            query: ({ id }) => ({
                url: `hrm/employees/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Employ"],
        }),

        // Fetch employees with filters/pagination
        employFetch: builder.query({
            query: ({ id } = {}) => ({
                url: "hrm/employees",
                method: "GET",
                params: id ? { ...getFilterParams(), id } : { ...getFilterParams() },
            }),
            providesTags: ["Employ"],
        }),

        // Search employees
        employSearch: builder.query({
            query: ({ search }) => ({
                url: "hrm/employees",
                method: "GET",
                params: search ? { search } : undefined,
            }),
            providesTags: ["Employ"],
        }),

        // Fetch single employee by ID
        employGetById: builder.query({
            query: (id) => ({
                url: `hrm/employees/${id}`,
                method: "GET",
            }),
            providesTags: ["Employ"],
        }),

        // Update assigned projects for employee (if applicable)
        employUpdateAssignedProjects: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `hrm/employees/${id}/projectEmployees`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Employ"],
        }),
    }),
});

export const {
    useEmployCreateMutation,
    useEmployUpdateMutation,
    useEmployDeleteMutation,
    useEmploySearchQuery,
    useEmployFetchQuery,
    useEmployGetByIdQuery,
    useEmployUpdateAssignedProjectsMutation,
    useLazyEmployFetchQuery,
    useGetEmployQuery,
} = employApi;
