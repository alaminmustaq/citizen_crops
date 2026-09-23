import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const toolDistributionApi = createApi({
  reducerPath: "ToolDistribution",
  baseQuery,
  tagTypes: ["ToolDistribution"],
  endpoints: (builder) => ({ 
    fetchToolDistributions: builder.query({
      query: () => ({
        url: "inventory/tool-distributions",
        params: { ...getFilterParams() },
      }),
      providesTags: ["ToolDistribution"],
    }),

    createToolDistribution: builder.mutation({
      query: (data) => ({
        url: "inventory/tool-distributions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ToolDistribution"],
    }),

    updateToolDistribution: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/tool-distributions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ToolDistribution"],
    }),

    deleteToolDistribution: builder.mutation({
      query: (id) => ({
        url: `inventory/tool-distributions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ToolDistribution"],
    }),

    returnTool: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `inventory/tool-distributions/${id}/return`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ToolDistribution"],
    }),
  }),
});

export const {
  useFetchToolDistributionsQuery,
  useCreateToolDistributionMutation,
  useUpdateToolDistributionMutation,
  useDeleteToolDistributionMutation,
  useReturnToolMutation,
} = toolDistributionApi;