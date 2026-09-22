import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const allowanceTypesApi = createApi({
  reducerPath: "allowance-type",
  baseQuery,
  tagTypes: ["allowance-type"],
  endpoints: (builder) => ({
    fetchAllowance: builder.query({
      query: ({ params } = {}) => ({
        url: "allowance/allowance_type",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["allowance-type"],
    }),
    
    createAllowance: builder.mutation({
      query: (data) => ({
        url: "allowance/allowance_type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["allowance-type"],
    }),
    updateAllowance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `allowance/allowance_type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["allowance-type"],
    }),
    deleteAllowance: builder.mutation({
      query: (id) => ({
        url: `allowance/allowance_type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allowance-type"],
    }),
  }),
});

export const {
  useFetchAllowanceQuery,
  useCreateAllowanceMutation,
  useUpdateAllowanceMutation,
  useDeleteAllowanceMutation,
} = allowanceTypesApi;
