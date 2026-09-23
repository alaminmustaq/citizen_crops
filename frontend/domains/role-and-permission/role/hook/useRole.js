import { handleServerValidationErrors } from "@/utility/helpers";
import {
    useRoleCreateMutation,
    useRoleUpdateMutation,
    useRoleDeleteMutation,
    useRoleFetchQuery,
    useRolePermissionsFetchQuery,
    useRolePermissionsUpdateMutation, // ✅ add this
    useRoleCheckAllPermissionsMutation, // ✅ add this
} from "../services/roleApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { formReset, setFilterParams } from "@/utility/helpers";
import { debounce } from "@/utility/helpers";
import { roleSearchTemplate } from "@/utility/templateHelper";
import { getFilterParams } from "@/utility/helpers";
import { useMemo } from "react";

export const useRole = () => {
    const [userCreate] = useRoleCreateMutation();
    const [userUpdate] = useRoleUpdateMutation();
    const [userDelete] = useRoleDeleteMutation();
    const [permissionsUpdate] = useRolePermissionsUpdateMutation();
    const [checkAllPermissions] = useRoleCheckAllPermissionsMutation(); // ✅ new
    const {
        data: roleAndPermission,
        refetch,
        isFetching,
    } = useRoleFetchQuery();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const rolesState = {
        data: roleAndPermission?.data?.roles || [],
        form,
        permissions: roleAndPermission?.data?.permissions || [],
        refetch,
        pagination: roleAndPermission?.data?.pagination || {},
        isFetching,
    };
    const actions = {
        onCreate: async (data) => {
            try {
                let { openModel, ...other } = data;

                const response = await userCreate(other).unwrap();
                if (response) {
                    toast.success("Role Create Successfully");
                    refetch();
                    formReset(form);

                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                // set server site single errors
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onEdit: (data) => {
            form.reset({
                id: data.id || "",
                name: data.name || "",
                display_name: data.display_name || "",
                description: data.description || "",
                is_system: data.is_system || false,
                parent_role_id: data.parent_role_id || null,
                level: data.level?.toString() ?? "0", // convert number to string for select
                metadata: data.metadata || null,
                created_at: data.created_at || "",
                updated_at: data.updated_at || "",
                deleted_at: data.deleted_at || "",
            });
            form.setValue("selectedPermission", []);

            form.setValue("openModel", true);
        },
        onUpdate: async (data) => {
            try {
                let { openModel, id, ...other } = data;

                // If you have any data normalization like employee, do it here
                // let preparedData = normalizeSelectValues(other, ["some_field"]);
                setFilterParams("page", 1);
                const response = await userUpdate({
                    id,
                    credentials: other, // or preparedData if normalized
                }).unwrap();

                if (response?.message === "Role updated successfully") {
                    toast.success("Role Update Successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
                if (response?.message === "Permissions updated successfully") {
                    toast.success("Permissions updated successfully");
                }

                return response;
            } catch (apiErrors) {
                // set server-side validation errors
                handleServerValidationErrors(apiErrors, form.setError);

                // optional: show general error toast
                toast.error(
                    "Failed to update role. Please check the inputs and try again."
                );
            }
        },
        onDelete: async (id) => {
            try {
                if (confirm("Are you sure you want to delete this role?")) {
                    const response = await userDelete({ id });

                    // If your API returns success in response.data.success
                    if (response?.data?.success) {
                        toast.success("Role deleted successfully");
                        refetch(); // refresh the list if needed
                    }
                    // If API returns error in a structured format
                    else if (response?.error?.data?.message) {
                        toast.error(response?.error?.data?.message);
                    }
                    // Fallback error
                    else {
                        toast.error("Failed to delete role. Please try again.");
                    }
                }
            } catch (error) {
                console.error("Delete role error:", error);

                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "Something went wrong while deleting the role."
                    );
                }
            }
        },
        onManagePermissions: (data) => {
            const ids = data.permissions.map((data) => data.id);

            form.setValue("id", data.id);
            form.setValue("openModel", true);
            form.setValue("openPermissionMode", true);
            form.setValue("selectedPermission", [...ids]);

            setFilterParams("page", 1);
        },
        // ✅ New action: Check All Permissions for a role
        onCheckAllPermissions: async (roleId, type) => {
            try {
                const response = await checkAllPermissions({
                    role_id: roleId,
                    type: type,
                }).unwrap();

                toast.success("All permissions assigned successfully!");
                return response;
            } catch (error) {
                console.error("Check all permissions error:", error);
                toast.error("Failed to assign all permissions.");
            }
        },
    };

    return {
        actions,
        rolesState,
    };
};
