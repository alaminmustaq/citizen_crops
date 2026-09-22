import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const advanceApi = createApi({
  reducerPath: "advance",
  baseQuery,
  tagTypes: ["advance"],
  endpoints: (builder) => ({
    fetchAdvance: builder.query({
      query: (params = {}) => ({
        url: "hrm/advance",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["advance"],
    }),
    
    createAdvance: builder.mutation({
      query: (data) => ({
        url: "hrm/advance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["advance"],
    }),

    updateAdvance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `hrm/advance/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["advance"],
    }),

    deleteAdvance: builder.mutation({
      query: (id) => ({
        url: `hrm/advance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["advance"],
    }),

    deleteGroupAdvance: builder.mutation({
      query: (data) => ({
        url: `hrm/advance/group_delete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["advance"],
    }), 

  }),
});

export const {
  useFetchAdvanceQuery,
  useCreateAdvanceMutation,
  useUpdateAdvanceMutation,
  useDeleteAdvanceMutation,
  useDeleteGroupAdvanceMutation,
} = advanceApi;
