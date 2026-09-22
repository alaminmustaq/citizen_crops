import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const employeeShiftApi = createApi({
  reducerPath: "employee-shift",
  baseQuery,
  tagTypes: ["employee-shift"],
  endpoints: (builder) => ({
    fetchEmployeeShifts: builder.query({
      query: ({ params } = {}) => ({
        url: "schedule/employee_shift",
        params: { ...getFilterParams(), ...params },
      }),
      providesTags: ["employee-shift"],
    }),

    createEmployeeShift: builder.mutation({
      query: (data) => ({
        url: "schedule/employee_shift",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employee-shift"],
    }),

    updateEmployeeShift: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `schedule/employee_shift/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["employee-shift"],
    }),

    deleteEmployeeShift: builder.mutation({
      query: (id) => ({
        url: `schedule/employee_shift/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee-shift"],
    }),
  }),
});

export const {
  useFetchEmployeeShiftsQuery,
  useCreateEmployeeShiftMutation,
  useUpdateEmployeeShiftMutation,
  useDeleteEmployeeShiftMutation,
} = employeeShiftApi;
