import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const bonusProcessApi = createApi({
    reducerPath: "bonus-process",
    baseQuery,
    tagTypes: ["bonus-process"],
    endpoints: (builder) => ({
        fetchBonusProcess: builder.query({
            query: (params = {}) => ({
                url: "bonus/process",
                params,
            }),
            providesTags: ["bonus-process"],
        }),
        fetchBonusProcessResults: builder.query({
            query: (params = {}) => ({
                url: "bonus/process/results",
                params,
            }),
            providesTags: ["bonus-process"],
        }),
        runBonusProcess: builder.mutation({
            query: (body) => ({
                url: "bonus/process/run",
                method: "POST",
                body,
            }),
            invalidatesTags: ["bonus-process"],
        }),
        deleteBonusProcessResult: builder.mutation({
            query: (id) => ({
                url: `bonus/process/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["bonus-process"],
        }),
    }),
});

export const {
    useFetchBonusProcessQuery,
    useLazyFetchBonusProcessQuery,
    useFetchBonusProcessResultsQuery,
    useLazyFetchBonusProcessResultsQuery,
    useRunBonusProcessMutation,
    useDeleteBonusProcessResultMutation,
} = bonusProcessApi;
