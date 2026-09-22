import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const recPaymentTypeApi = createApi({
    reducerPath: "RecPaymentType",
    baseQuery: baseQuery,
    tagTypes: ["RecPaymentType"],
    endpoints: (builder) => ({

        recPaymentTypeCreate: builder.mutation({
            query: (credentials) => ({
                url: "finance/rec-payment-types",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["RecPaymentType"],
        }),

        recPaymentTypeUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `finance/rec-payment-types/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["RecPaymentType"],
        }),

        recPaymentTypeDelete: builder.mutation({
            query: ({ id }) => ({
                url: `finance/rec-payment-types/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RecPaymentType"],
        }),

        recPaymentTypeFetch: builder.query({
            query: () => ({
                url: "finance/rec-payment-types",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            providesTags: ["RecPaymentType"],
        }),

        recPaymentTypeSearch: builder.query({
            query: ({ search }) => ({
                url: "finance/rec-payment-types",
                method: "GET",
                params: search ? { search } : undefined,
            }),
            providesTags: ["RecPaymentType"],
        }),

    }),
});

export const {
    useRecPaymentTypeCreateMutation,
    useRecPaymentTypeUpdateMutation,
    useRecPaymentTypeDeleteMutation,
    useRecPaymentTypeFetchQuery,
    useRecPaymentTypeSearchQuery,
} = recPaymentTypeApi;
