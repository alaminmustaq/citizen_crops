import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const warehouseApi = createApi({
    reducerPath: "Warehouse",
    baseQuery: baseQuery,
    tagTypes: ["Warehouse"],
    endpoints: (builder) => ({
        warehouseCreate: builder.mutation({
            query: (credentials) => ({
                url: "inventory/warehouses",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Warehouse"],
        }),

        warehouseUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `inventory/warehouses/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Warehouse"],
        }),

        warehouseDelete: builder.mutation({
            query: ({ id }) => ({
                url: `inventory/warehouses/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Warehouse"],
        }),

        warehouseFetch: builder.query({
            query: () => ({
                url: "inventory/warehouses",
                method: "GET",
                params: { ...getFilterParams() }, // supports pagination, filters, etc.
            }),
            providesTags: ["Warehouse"],
        }),

        warehouseSearch: builder.query({
            query: ({ search }) => ({
                url: "inventory/warehouses",
                method: "GET",
                params: search ? { search } : undefined,
            }),
            providesTags: ["Warehouse"],
        }),
    }),
});

export const {
    useWarehouseCreateMutation,
    useWarehouseUpdateMutation,
    useWarehouseDeleteMutation,
    useWarehouseFetchQuery,
    useWarehouseSearchQuery,
} = warehouseApi;
