import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const emailTemplateApi = createApi({
    reducerPath: "email-template",
    baseQuery,
    tagTypes: ["email-template"],
    endpoints: (builder) => ({
        fetchEmailTemplateList: builder.query({
            query: ({ params } = {}) => ({
                url: "system/email_templates",
                params: { ...getFilterParams(), ...params },
            }),
            providesTags: ["email-template"],
        }),

        createEmailTemplate: builder.mutation({
            query: (data) => ({
                url: "system/email_templates",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["email-template"],
        }),

        updateEmailTemplate: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `system/email_templates/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["email-template"],
        }),

        deleteEmailTemplate: builder.mutation({
            query: (id) => ({
                url: `system/email_templates/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["email-template"],
        }),
    }),
});

export const {
    useFetchEmailTemplateListQuery,
    useCreateEmailTemplateMutation,
    useUpdateEmailTemplateMutation,
    useDeleteEmailTemplateMutation,
} = emailTemplateApi;
