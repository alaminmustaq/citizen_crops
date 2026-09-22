import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const bonusSetupApi = createApi({
    reducerPath: "bonus-setup",
    baseQuery,
    tagTypes: ["bonus-setup"],
    endpoints: (builder) => ({
        fetchBonusSetups: builder.query({
            query: ({ params } = {}) => ({
                url: "bonus/bonus_setup",
                params: { ...getFilterParams(), ...params },
            }),
            providesTags: ["bonus-setup"],
        }),
        createBonusSetup: builder.mutation({
            query: (data) => ({
                url: "bonus/bonus_setup",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["bonus-setup"],
        }),
        updateBonusSetup: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `bonus/bonus_setup/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["bonus-setup"],
        }),
        deleteBonusSetup: builder.mutation({
            query: (id) => ({
                url: `bonus/bonus_setup/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["bonus-setup"],
        }),
    }),
});

export const {
    useFetchBonusSetupsQuery,
    useCreateBonusSetupMutation,
    useUpdateBonusSetupMutation,
    useDeleteBonusSetupMutation,
} = bonusSetupApi;
