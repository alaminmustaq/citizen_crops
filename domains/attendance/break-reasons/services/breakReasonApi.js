import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const breakReasonApi = createApi({
    reducerPath: "breakReasonApi",
    baseQuery,
    tagTypes: ["BreakReason"],
    endpoints: (builder) => ({
        fetchBreakReasons: builder.query({
            query: (params = null) => ({
                url: "hrm/break-reasons",
                params: params || { ...getFilterParams() },
            }),
            providesTags: ["BreakReason"],
        }),
        createBreakReason: builder.mutation({
            query: (data) => ({
                url: "hrm/break-reasons",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["BreakReason"],
        }),
        updateBreakReason: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `hrm/break-reasons/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["BreakReason"],
        }),
        deleteBreakReason: builder.mutation({
            query: (id) => ({
                url: `hrm/break-reasons/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BreakReason"],
        }),
    }),
});

export const {
    useFetchBreakReasonsQuery,
    useCreateBreakReasonMutation,
    useUpdateBreakReasonMutation,
    useDeleteBreakReasonMutation,
} = breakReasonApi;
