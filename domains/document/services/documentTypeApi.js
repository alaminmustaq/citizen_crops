import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const documentTypeApi = createApi({
    reducerPath: "documentTypeApi",
    baseQuery: baseQuery,
    tagTypes: ["DocumentType"],
    endpoints: (builder) => ({
        createDocumentType: builder.mutation({
            query: (credentials) => ({
                url: "document_management/document-type",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["DocumentType"],
        }),
        updateDocumentType: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `document_management/document-type/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["DocumentType"],
        }),
        deleteDocumentType: builder.mutation({
            query: ({ id }) => ({
                url: `document_management/document-type/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DocumentType"],
        }),
        fetchDocumentTypes: builder.query({
            query: () => ({
                url: "document_management/document-type",
                method: "GET",
                params: { ...getFilterParams() },
            }),
            providesTags: ["DocumentType"],
        }),
    
    }),
});

export const {
    useCreateDocumentTypeMutation,
    useUpdateDocumentTypeMutation,
    useDeleteDocumentTypeMutation,
    useFetchDocumentTypesQuery,
    useSearchDocumentTypesQuery,
} = documentTypeApi;
