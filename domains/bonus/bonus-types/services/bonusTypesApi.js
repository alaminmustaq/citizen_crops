import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const bonusTypesApi = createApi({
  reducerPath: "bonus-type",
  baseQuery,
  tagTypes: ["bonus-type"],
  endpoints: (builder) => ({
    fetchBonusTypes: builder.query({
      query: ({ params } = {}) => ({
        url: "bonus/bonus_type",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["bonus-type"],
    }),
    createBonusType: builder.mutation({
      query: (data) => ({
        url: "bonus/bonus_type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bonus-type"],
    }),
    updateBonusType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `bonus/bonus_type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["bonus-type"],
    }),
    deleteBonusType: builder.mutation({
      query: (id) => ({
        url: `bonus/bonus_type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bonus-type"],
    }),
  }),
});

export const {
  useFetchBonusTypesQuery,
  useCreateBonusTypeMutation,
  useUpdateBonusTypeMutation,
  useDeleteBonusTypeMutation,
} = bonusTypesApi;
