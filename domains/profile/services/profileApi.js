import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";

export const profileApi = createApi({
  reducerPath: "profile",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: ({id=false}) => ({
        url: "/profile/profile",
        method: "GET",
        params: { id: id },
      }), 
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (data) => {
        const isFormData = data instanceof FormData;
        if (isFormData) data.append("_method", "PUT");
        return {
        url: "/profile/profile",
        method: "POST",
        body: data,
        headers: isFormData ? {} : { "Content-Type": "application/json" },
      }},
      invalidatesTags: ["Profile"],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "profile/profile/password",
        method: "POST",
        body: data, // { current_password, new_password, confirm_password }
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useLazyGetProfileQuery, useUpdatePasswordMutation } = profileApi;
