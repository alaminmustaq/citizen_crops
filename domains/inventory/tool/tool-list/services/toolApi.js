import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";
export const toolApi = createApi({
    reducerPath: "Tool",
    baseQuery,
    tagTypes: ["Tool"],
    endpoints: (builder) => ({
        fetchTools: builder.query({
            query: ({ params } = {}) => ({
                url: "inventory/tools",
                method: "GET",
                params: {
                    ...getFilterParams(),
                    ...params,
                },
            }),
            providesTags: ["Tool"],
        }),

        createTool: builder.mutation({
            query: (data) => ({
                url: "inventory/tools",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tool"],
        }),

        updateTool: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `inventory/tools/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Tool"],
        }),

        deleteTool: builder.mutation({
            query: (id) => ({
                url: `inventory/tools/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tool"],
        }),
    }),
});

export const {
    useFetchToolsQuery,
    useCreateToolMutation,
    useUpdateToolMutation,
    useDeleteToolMutation,
} = toolApi;
