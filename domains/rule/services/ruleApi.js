import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const ruleApi = createApi({
    reducerPath: "ruleApi",
    baseQuery,
    tagTypes: ["GeneralRule", "PunishmentRule"],

    endpoints: (builder) => ({
        // 📥 FETCH BOTH (optional combined endpoint)
        fetchRules: builder.query({
            query: () => ({
                url: "rules",
                method: "GET",
            }),
            providesTags: ["GeneralRule", "PunishmentRule"],
        }),

        // 🟦 GENERAL RULE UPDATE
        updateRules: builder.mutation({
            query: (data) => ({
                url: "rules",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["GeneralRule"],
        }),

        // 🟥 PUNISHMENT RULE UPDATE
        updatePunishmentRules: builder.mutation({
            query: (data) => ({
                url: "punishment-rules",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PunishmentRule"],
        }),
    }),
});

export const {
    useFetchRulesQuery,
    useUpdateRulesMutation,
    useUpdatePunishmentRulesMutation,
} = ruleApi;
