import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const purchaseApi = createApi({
  reducerPath: "Purchase",
  baseQuery,
  tagTypes: ["Purchase"],
  endpoints: (builder) => ({ 
    fetchPurchases: builder.query({
      query: () => ({
        url: "inventory/purchases",
        params: { ...getFilterParams() },
      }),
      providesTags: ["Purchase"],
    }),

    createPurchase: builder.mutation({
      query: (data) => ({
        url: "inventory/purchases",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Purchase"],
    }),

    updatePurchase: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/purchases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Purchase"],
    }),

    deletePurchase: builder.mutation({
      query: (id) => ({
        url: `inventory/purchases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase"],
    }),
  }),
});

export const {
  useFetchPurchasesQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
