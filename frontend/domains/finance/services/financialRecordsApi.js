import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const financialRecordsApi = createApi({
    reducerPath: "financialRecordsApi",
    baseQuery: baseQuery,
    tagTypes: ["FinancialRecord"],
    endpoints: (builder) => ({
        createFinancialRecord: builder.mutation({
            query: (credentials) => {
                const isFormData = credentials instanceof FormData;
                return {
                    url: "finance/financial-records",
                    method: "POST",
                    body: credentials,
                    headers: isFormData
                        ? {}
                        : { "Content-Type": "application/json" },
                };
            },
            invalidatesTags: ["FinancialRecord"],
        }),
        updateFinancialRecord: builder.mutation({
            query: ({ id, credentials }) => {
                const isFormData = credentials instanceof FormData;
                return {
                    url: `finance/financial-records/${id}`,
                    method: isFormData ? "POST" : "PUT",
                    body: isFormData
                        ? (() => {
                              credentials.append("_method", "PUT");
                              return credentials;
                          })()
                        : credentials,
                    headers: isFormData
                        ? {}
                        : { "Content-Type": "application/json" },
                };
            },
            invalidatesTags: ["FinancialRecord"],
        }),
        deleteFinancialRecord: builder.mutation({
            query: ({ id }) => ({
                url: `finance/financial-records/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["FinancialRecord"],
        }),
        fetchFinancialRecords: builder.query({
            query: () => ({
                url: "finance/financial-records",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            providesTags: ["FinancialRecord"],
        }),
    }),
});

export const {
    useCreateFinancialRecordMutation,
    useUpdateFinancialRecordMutation,
    useDeleteFinancialRecordMutation,
    useFetchFinancialRecordsQuery,
} = financialRecordsApi;
