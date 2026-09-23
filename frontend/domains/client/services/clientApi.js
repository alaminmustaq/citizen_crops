import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const clientApi = createApi({
    reducerPath: "Client",
    baseQuery: baseQuery,
    tagTypes: ["Client"],
    endpoints: (builder) => ({
        clientCreate: builder.mutation({
            query: (credentials) => ({
                url: "clients/clients",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Client"],
        }),
        clientUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `clients/clients/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Client"],
        }),
        clientDelete: builder.mutation({
            query: ({ id }) => ({
                url: `clients/clients/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Client"],
        }),
        clientFetch: builder.query({
            query: () => ({
                url: "clients/clients",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            providesTags: ["Client"],
        }),
        clientSearch: builder.query({
            query: ({ search }) => ({
                url: "clients/clients",
                method: "GET",
                params: search ? { search } : undefined,
            }),
            providesTags: ["Client"],
        }),
        clientShow: builder.query({
            query: ({ id }) => ({
                url: `clients/clients/${id}`,
                method: "GET",
            }),
            providesTags: ["Client"],
        }),
    }),
});

export const {
    useClientCreateMutation,
    useClientUpdateMutation,
    useClientDeleteMutation,
    useClientFetchQuery,
    useClientSearchQuery,
    useClientShowQuery,
} = clientApi;
