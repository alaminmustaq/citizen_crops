import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const generalSettingApi = createApi({
    reducerPath: "generalSettingApi",
    baseQuery: baseQuery,
    tagTypes: ["GeneralSetting"],

    endpoints: (builder) => ({
        // Fetch general settings (single record)
        fetchGeneralSettings: builder.query({
            query: () => ({ url: "general-settings", method: "GET" }),
            providesTags: ["GeneralSetting"],
        }),

        // Update general settings
        updateGeneralSettings: builder.mutation({
             query: ({ id, formData }) => ({
                url: `/general-settings/${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["GeneralSetting"],
        }),
    }),
});

export const {
    useFetchGeneralSettingsQuery,
    useUpdateGeneralSettingsMutation,
} = generalSettingApi;
