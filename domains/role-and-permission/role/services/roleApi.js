import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/utility/baseQuery";
import { getFilterParams } from "@/utility/helpers";

export const roleApi = createApi({
    reducerPath: "Role",
    baseQuery: baseQuery,
    tagTypes: ["Role"],
    endpoints: (builder) => ({
        // Create role
        roleCreate: builder.mutation({
            query: (credentials) => ({
                url: "admin/roles-permissions/roles",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Role"],
        }),

        // Update role
        roleUpdate: builder.mutation({
            query: ({ id, credentials }) => ({
                url: `admin/roles-permissions/roles/${id}`,
                method: "PUT",
                body: credentials,
            }),
            invalidatesTags: ["Role"],
        }),

        // Delete role
        roleDelete: builder.mutation({
            query: ({ id }) => ({
                url: `admin/roles-permissions/roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Role"],
        }),

        // Fetch all roles
        roleFetch: builder.query({
            query: () => ({
                url: "admin/roles-permissions/roles",
                method: "GET",
                params: { ...getFilterParams() }, // fetch all roles
            }),
            providesTags: ["Role"],
        }),

        // Fetch permissions for a specific role
        rolePermissionsFetch: builder.query({
            query: (roleId) =>
                `admin/roles-permissions/roles/${roleId}/permissions`,
            providesTags: ["Role"],
        }),

        // Update permissions for a specific role
        rolePermissionsUpdate: builder.mutation({
            query: ({ roleId, permission_ids }) => ({
                url: `admin/roles-permissions/roles/${roleId}/permissions`,
                method: "POST",
                body: { permission_ids },
            }),
            invalidatesTags: ["Role"],
        }),

        // ✅ Check all permissions for a specific role
        roleCheckAllPermissions: builder.mutation({
            query: (data) => ({
                url: `admin/roles-permissions/roles/role/permissions/check-all`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Role"],
        }),
    }),
});

// Export hooks
export const {
    useRoleCreateMutation,
    useRoleUpdateMutation,
    useRoleDeleteMutation,
    useRoleFetchQuery,
    useRolePermissionsFetchQuery,
    useRolePermissionsUpdateMutation,
    useRoleCheckAllPermissionsMutation,
} = roleApi;
