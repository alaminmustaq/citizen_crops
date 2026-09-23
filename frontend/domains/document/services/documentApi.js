import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const documentApi = createApi({
    reducerPath: "documentApi",
    baseQuery: baseQuery,
    tagTypes: ["Document"],
    endpoints: (builder) => ({
        createDocument: builder.mutation({
            query: (credentials) => {
                const isFormData = credentials instanceof FormData;
                return {
                    url: "document_management/documents",
                    method: "POST",
                    body: credentials,
                    // Don't set Content-Type for FormData, let browser handle it
                    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
                };
            },
            invalidatesTags: ["Document"],
        }),
        updateDocument: builder.mutation({
            query: ({ id, credentials }) => {
                const isFormData = credentials instanceof FormData;
                return {
                    url: `document_management/documents/${id}`,
                    method: "POST", // Changed to POST for FormData with _method override
                    body: isFormData ? (() => {
                        credentials.append('_method', 'PUT');
                        return credentials;
                    })() : credentials,
                    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
                };
            },
            invalidatesTags: ["Document"],
        }),
        deleteDocument: builder.mutation({
            query: ({ id }) => ({
                url: `document_management/documents/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Document"],
        }),
        deleteDocumentDetail: builder.mutation({
            query: ({ documentId, detailId }) => ({
                url: `document_management/documents/${documentId}/details/${detailId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Document"],
        }),
        fetchDocuments: builder.query({
            query: () => ({
                url: "document_management/documents",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            providesTags: ["Document"],
        }),
    }),
});

export const {
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
    useDeleteDocumentDetailMutation,
    useFetchDocumentsQuery,
} = documentApi;