import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const salaryApi = createApi({
    reducerPath: "salaryApi",
    baseQuery: baseQuery,
    tagTypes: ["Salary", "JobPosition"],

    endpoints: (builder) => ({
        // Create salary
        salaryCreate: builder.mutation({
            query: (credentials) => ({
                url: "hrm/salaries",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Salary"],
        }),

        // Fetch all salaries with filters and pagination
        salaryFetch: builder.query({
            query: (params) => ({
                url: "hrm/salaries",
                method: "GET",
                params: { ...getFilterParams(), ...params }, // fetch all salaries with filters
            }),
            providesTags: ["Salary"],
        }),

        // Search salaries by keyword
        salarySearch: builder.query({
            query: ({ search, ...params }) => ({
                url: "hrm/salaries",
                method: "GET",
                params: {
                    search,
                    per_page: params.per_page || 15,
                    page: params.page || 1,
                    ...params
                },
            }),
            providesTags: ["Salary"],
        }),

        // Filter salaries by IDs (company, branch, department, job position)
        salaryFilter: builder.mutation({
            query: ({
                company_id,
                branch_id,
                department_id,
                job_position_id,
            }) => ({
                url: "hrm/salaries/filter",
                method: "POST",
                body: { company_id, branch_id, department_id, job_position_id },
            }),
            invalidatesTags: ["JobPosition"],
        }),

        // Get salary by ID
        salaryGetById: builder.query({
            query: (id) => ({
                url: `hrm/salaries/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Salary", id }],
        }),

        // Update salary
        salaryUpdate: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `hrm/salaries/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Salary", id },
                "Salary"
            ],
        }),

        // Delete salary
        salaryDelete: builder.mutation({
            query: (id) => ({
                url: `hrm/salaries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Salary"],
        }),

        // Record salary payment (disbursal)
        salaryPay: builder.mutation({
            query: ({ salaryId, ...data }) => ({
                url: `hrm/salaries/${salaryId}/payments`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Salary"],
        }),

        // Record bulk salary payment
        salaryBulkPay: builder.mutation({
            query: (data) => ({
                url: "hrm/salaries/bulk-payment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Salary"],
        }),

        // Fetch payments history for a salary
        salaryGetPayments: builder.query({
            query: (salaryId) => ({
                url: `hrm/salaries/${salaryId}/payments`,
                method: "GET",
            }),
            providesTags: (result, error, salaryId) => [{ type: "Salary", id: salaryId }],
        }),

        // Fetch active bank branches for payment selection
        bankFetchActive: builder.query({
            query: () => ({
                url: "bank/banks",
                method: "GET",
                params: { isActive: true, per_page: 100 },
            }),
        }),

        // Preview employees for salary generation
        salaryPreview: builder.mutation({
            query: (data) => ({
                url: "hrm/salaries/preview",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useSalaryCreateMutation,
    useSalaryFetchQuery,
    useLazySalaryFetchQuery,
    useSalarySearchQuery,
    useLazySalarySearchQuery,
    useSalaryFilterMutation,
    useSalaryGetByIdQuery,
    useLazySalaryGetByIdQuery,
    useSalaryUpdateMutation,
    useSalaryDeleteMutation,
    useSalaryPayMutation,
    useSalaryBulkPayMutation,
    useSalaryGetPaymentsQuery,
    useBankFetchActiveQuery,
    useSalaryPreviewMutation,
} = salaryApi;
