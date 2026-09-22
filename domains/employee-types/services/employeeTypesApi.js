import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const employeeTypesApi = createApi({
  reducerPath: "employee-type",
  baseQuery,
  tagTypes: ["employee-type"],
  endpoints: (builder) => ({
    fetchEmployeeTypes: builder.query({
      query: () => ({
        url: "schedule/employee_type",
        params: { ...getFilterParams() },
      }),
      providesTags: ["employee-type"],
    }),

    createEmployeeType: builder.mutation({
      query: (data) => ({
        url: "schedule/employee_type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employee-type"],
    }),

    updateEmployeeType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `schedule/employee_type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["employee-type"],
    }),

    deleteEmployeeType: builder.mutation({
      query: (id) => ({
        url: `schedule/employee_type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee-type"],
    }),
  }),
});

export const {
  useFetchEmployeeTypesQuery,
  useCreateEmployeeTypeMutation,
  useUpdateEmployeeTypeMutation,
  useDeleteEmployeeTypeMutation,
} = employeeTypesApi;
