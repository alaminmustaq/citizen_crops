import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const reportApi = createApi({
    reducerPath: "ReportApi",
    baseQuery,
    tagTypes: ["Report"],
    endpoints: (builder) => ({
        fetchReport: builder.query({
            query: ({ route = "reports", params = {} }) => ({
                url: `${route}`,
                params: {
                    ...getFilterParams(),
                    ...params,
                },
            }),
            providesTags: ["Report"],
        }),
        generateReport: builder.mutation({
            query: ({ route, filters, format, token }) => ({
                url: `report/${route}/${format}`,
                method: "GET",
                params: { ...filters, token },
            }),
        }),
    }),
});

export const { useFetchReportQuery,useGenerateReportMutation } = reportApi;
