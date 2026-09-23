import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const stockTransferApi = createApi({
  reducerPath: "StockTransfer",
  baseQuery,
  tagTypes: ["StockTransfer"],
  endpoints: (builder) => ({ 
    fetchStockTransfers: builder.query({
      query: () => ({
        url: "inventory/stock-transfers",
        params: { ...getFilterParams() },
      }),
      providesTags: ["StockTransfer"],
    }),

    createStockTransfer: builder.mutation({
      query: (data) => ({
        url: "inventory/stock-transfers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StockTransfer"],
    }),

    updateStockTransfer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/stock-transfers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["StockTransfer"],
    }),

    deleteStockTransfer: builder.mutation({
      query: (id) => ({
        url: `inventory/stock-transfers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StockTransfer"],
    }),
  }),
});

export const {
  useFetchStockTransfersQuery,
  useCreateStockTransferMutation,
  useUpdateStockTransferMutation,
  useDeleteStockTransferMutation,
} = stockTransferApi;
