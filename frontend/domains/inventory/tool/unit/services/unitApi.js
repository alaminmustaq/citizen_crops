import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const unitApi = createApi({
  reducerPath: "ToolUnit",
  baseQuery,
  tagTypes: ["ToolUnit"],
  endpoints: (builder) => ({
    fetchUnits: builder.query({
      query: () => ({
        url: "inventory/tool-units",
        params: { ...getFilterParams() },
      }),
      providesTags: ["ToolUnit"],
    }),
    createUnit: builder.mutation({
      query: (data) => ({
        url: "inventory/tool-units",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ToolUnit"],
    }),
    updateUnit: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/tool-units/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ToolUnit"],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `inventory/tool-units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ToolUnit"],
    }),
  }),
});

export const {
  useFetchUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
