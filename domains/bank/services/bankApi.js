import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const bankApi = createApi({
  reducerPath: "Bank",
  baseQuery,
  tagTypes: ["Bank"],
  endpoints: (builder) => ({ 
    fetchBanks: builder.query({
      query: () => ({
        url: "bank/banks",
        params: { ...getFilterParams() },
      }),
      providesTags: ["Bank"],
    }),

    createBank: builder.mutation({
      query: (data) => ({
        url: "bank/banks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bank"],
    }),

    updateBank: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `bank/banks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Bank"],
    }),

    deleteBank: builder.mutation({
      query: (id) => ({
        url: `bank/banks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bank"],
    }),
     fetchBankBranches: builder.query({
      query: (bankId) => `bank/banks/${bankId}/branches`,
      providesTags: ["BankBranches"],
    }),
  }),
});

export const {
  useFetchBanksQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
  useFetchBankBranchesQuery,
} = bankApi;
