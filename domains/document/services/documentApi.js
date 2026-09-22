// services/documentApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const documentApi = createApi({
    reducerPath: "documentApi",
    baseQuery: baseQuery,
    tagTypes: ["Document"],
    endpoints: (builder) => ({
        // Create document
        createDocument: builder.mutation({
            query: (credentials) => {
                const isFormData = credentials instanceof FormData;
                return {
                    url: "document_management/documents",
                    method: "POST",
                    body: credentials,
                    headers: isFormData ? {} : { "Content-Type": "application/json" },
                };
            },
            invalidatesTags: ["Document"],
        }),

        // Update document
        updateDocument: builder.mutation({
            query: ({ id, credentials }) => {
                const isFormData = credentials instanceof FormData;
                if (isFormData) credentials.append("_method", "PUT");
                return {
                    url: `document_management/documents/${id}`,
                    method: "POST",
                    body: credentials,
                    headers: isFormData ? {} : { "Content-Type": "application/json" },
                };
            },
            invalidatesTags: ["Document"],
        }),

        // Delete document
        deleteDocument: builder.mutation({
            query: ({ id }) => ({
                url: `document_management/documents/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Document"],
        }),

        // Delete document detail
        deleteDocumentDetail: builder.mutation({
            query: ({ documentId, detailId }) => ({
                url: `document_management/documents/${documentId}/details/${detailId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Document"],
        }),

        // Fetch all documents
        // fetchDocuments: builder.query({
        //     query: () => ({
        //         url: "document_management/documents",
        //         method: "GET",
        //         params: { ...getFilterParams() },
        //     }),
        //     providesTags: ["Document"],
        // }),

         fetchDocuments: builder.query({
                    query: ({ id, params } = {}) => {
                        const filterParams = {
                            ...getFilterParams(),
                            ...params,
                            ...(id ? { id } : {}),
                        };
        
                        return {
                           url: "document_management/documents",
                            method: "GET",
                            params: filterParams,
                        };
                    },
                    providesTags: ["Document"],
                }),

        // Fetch single document by ID (with details)
        getDocumentById: builder.query({
            query: (id) => ({
                url: `document_management/documents/${id}`,
                method: "GET",
            }),
            providesTags: ["Document"],
        }),
        // fetchDocuments: builder.query({
        //     query: ({ id, params } = {}) => ({
        //         url: "document_management/documents",
        //         method: "GET",
        //         params: id
        //             ? { ...getFilterParams(), id }
        //             : { ...getFilterParams() },
        //     }),
        //     providesTags: ["Document"],
        // }),
    }),
});

export const {
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
    useDeleteDocumentDetailMutation,
    useFetchDocumentsQuery,
    useGetDocumentByIdQuery,        // fetch single document directly
    useLazyGetDocumentByIdQuery,    // lazy fetch for single document (like useLazyEmployFetchQuery)
} = documentApi;
