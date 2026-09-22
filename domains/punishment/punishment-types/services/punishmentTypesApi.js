import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const punishmentTypesApi = createApi({
  reducerPath: "punishment-type",
  baseQuery,
  tagTypes: ["punishment-type"],
  endpoints: (builder) => ({
    fetchPunishment: builder.query({
      query: ({ params } = {}) => ({
        url: "punishment/punishment_type",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["punishment-type"],
    }),
    
    createPunishment: builder.mutation({
      query: (data) => ({
        url: "punishment/punishment_type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["punishment-type"],
    }),
    updatePunishment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `punishment/punishment_type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["punishment-type"],
    }),
    deletePunishment: builder.mutation({
      query: (id) => ({
        url: `punishment/punishment_type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["punishment-type"],
    }),
  }),
});

export const {
  useFetchPunishmentQuery,
  useCreatePunishmentMutation,
  useUpdatePunishmentMutation,
  useDeletePunishmentMutation,
} = punishmentTypesApi;
