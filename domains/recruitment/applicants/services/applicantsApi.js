import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const applicantsApi = createApi({
    reducerPath: "applicants",
    baseQuery,
    tagTypes: ["applicants"],
    endpoints: (builder) => ({
        fetchApplicants: builder.query({
            query: ({ params } = {}) => ({
                url: "recruitment/job_applications",
                params: { ...getFilterParams(), ...params },
            }),
            providesTags: ["applicants"],
        }),

        updateApplicantStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `recruitment/job_applications/${id}/status`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["applicants"],
        }),
    }),
});

export const {
    useFetchApplicantsQuery,
    useUpdateApplicantStatusMutation,
} = applicantsApi;
