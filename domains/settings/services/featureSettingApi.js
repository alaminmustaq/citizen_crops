import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const featureSettingApi = createApi({
    reducerPath: "featureSettingApi",
    baseQuery,
    tagTypes: ["FeatureSetting"],
    endpoints: (builder) => ({
        fetchFeatureSettings: builder.query({
            query: () => ({
                url: "feature-settings",
                method: "GET",
            }),
            providesTags: ["FeatureSetting"],
        }),
    }),
});

export const { useFetchFeatureSettingsQuery } = featureSettingApi;
