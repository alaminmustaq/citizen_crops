import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const earningDeductionApi = createApi({
  reducerPath: "earning-deduction",
  baseQuery,
  tagTypes: ["earning-deduction"],
  endpoints: (builder) => ({
    fetchEarningDeduction: builder.query({
      query: ({ params } = {}) => ({
        url: "allowance/earning_deduction",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["earning-deduction"],
    }),
    
    createEarningDeduction: builder.mutation({
      query: (data) => ({
        url: "allowance/earning_deduction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["earning-deduction"],
    }),
    updateEarningDeduction: builder.mutation({
      query: ({ id, ...data }) => {
        console.log('Updating EarningDeduction with ID:', id); // Must be full UUID
        return {
          url: `allowance/earning_deduction/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["earning-deduction"],
    }),
    deleteEarningDeduction: builder.mutation({
      query: (id) => ({
        url: `allowance/earning_deduction/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["earning-deduction"],
    }),
    deleteGroupEarningDeduction: builder.mutation({
      query: (data) => ({
        url: `allowance/group_delete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["earning-deduction"],
    }), 

  }),
});

export const {
  useFetchEarningDeductionQuery,
  useCreateEarningDeductionMutation,
  useUpdateEarningDeductionMutation,
  useDeleteEarningDeductionMutation,
  useDeleteGroupEarningDeductionMutation,

  useApproveEarningDeductionMutation,
} = earningDeductionApi;
