import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const punishmentGeneralApi = createApi({
  reducerPath: "punishment-general",
  baseQuery,
  tagTypes: ["punishment-general"],
  endpoints: (builder) => ({
    fetchPunishmentGeneral: builder.query({
      query: ({ params } = {}) => ({
        url: "punishment/punishment_general",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["punishment-general"],
    }),
    
    createPunishmentGeneral: builder.mutation({
      query: (data) => ({
        url: "punishment/punishment_general",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["punishment-general"],
    }),
    updatePunishmentGeneral: builder.mutation({
      query: ({ id, ...data }) => {
        console.log('Updating PunishmentGeneral with ID:', id); // Must be full UUID
        return {
          url: `punishment/punishment_general/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["punishment-general"],
    }),
    deletePunishmentGeneral: builder.mutation({
      query: (id) => ({
        url: `punishment/punishment_general/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["punishment-general"],
    }),
    deleteGroupPunishmentGeneral: builder.mutation({
      query: (data) => ({
        url: `punishment/group_delete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["punishment-general"],
    }), 

  }),
});

export const {
  useFetchPunishmentGeneralQuery,
  useCreatePunishmentGeneralMutation,
  useUpdatePunishmentGeneralMutation,
  useDeletePunishmentGeneralMutation,
  useDeleteGroupPunishmentGeneralMutation,

  useApprovePunishmentGeneralMutation,
} = punishmentGeneralApi;
