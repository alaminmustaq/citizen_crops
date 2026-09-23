import {
    handleServerValidationErrors,
    handleServerValidationErrorsToast,
} from "@/utility/helpers";
import {
    useBranchCreateMutation,
    useBranchUpdateMutation,
    useBranchDeleteMutation,
    useBranchFetchQuery,
    useBranchSearchQuery,
} from "../services/branchApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { formReset, normalizeSelectValues } from "@/utility/helpers";
import { debounce } from "@/utility/helpers";
import { branchSearchTemplate } from "@/utility/templateHelper";
import { getFilterParams } from "@/utility/helpers";
import { useMemo } from "react";

export const useBranch = () => {
    const [branchCreate] = useBranchCreateMutation();
    const [branchUpdate] = useBranchUpdateMutation();
    const [branchDelete] = useBranchDeleteMutation();
    const { data: branch, refetch, isFetching } = useBranchFetchQuery();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const { data: branchSearchResult} = useBranchSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") } // skip query if empty
    );

    const branchesState = {
        data: branch?.data?.branches || [],
        form,
        refetch,
        pagination: branch?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onCreate: async (data) => {
            try {
                let { openModel, ...other } = data;
                let preparedData = normalizeSelectValues(other, [
                    // "company_id",
                    "parent_branch_id",
                ]);

                const response = await branchCreate(preparedData).unwrap();

                if (response.success) {
                    toast.success("Branch Create Successfully");
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
            console.log(data);
            
            form.reset({
                // IDs
                id: data.id || "",
                parent_branch_id:
                    branchSearchTemplate(
                        data?.parent_branch ? [data.parent_branch] : []
                    )?.at(0) ?? null,

                // Core
                name: data.name || "",
                code: data.code || "",
                description: data.description || "",
                type: data.type || "",
                time_zone: data.location_info.time_zone || "",

                // Manager
                manager_name: data.manager_name || "",
                manager_email: data.manager_email || "",
                manager_phone: data.manager_phone || "",

                // Hierarchy
                hierarchy_level: data?.hierarchy_info?.hierarchy_level ?? "",
                hierarchy_path: data.hierarchy_path || "",
                is_headquarters: Boolean(data.is_headquarters),
                sort_order: data.sort_order ?? 0,

                // Contact
                email: data.email || "",
                phone: data.phone || "",
                fax: data.fax || "",

                // Address
                address_line_1: data.address_line_1 || "",
                address_line_2: data.address_line_2 || "",
                city: data.city || "",
                state: data.state || "",
                postal_code: data.postal_code || "",
                country: data.country || "",

                // Location
                latitude: data.latitude ?? "",
                longitude: data.longitude ?? "",
                allowed_range_meters: data.allowed_range_meters ?? "",
                timezone: data.timezone || "",

                // Operational
                opening_time: data.operating_hours_start || "", // e.g. "09:00"
                closing_time: data.operating_hours_end || "", // e.g. "18:00"
                operating_days: data.operating_days || "",
                max_employees: data.max_employees ?? "", // keep as "" for number input
                branch_type: data.operational_info?.branch_type || "",

                // System
                status: data.status || "inactive",
                is_enabled: Boolean(data.is_enabled),
                established_date: data.established_date || "", // "YYYY-MM-DD"
            });

            form.setValue("openModel", true);
            // updateUser({ id, ...data });
            // form.reset();
        },

        onUpdate: async (data) => {
            try {
                let { openModel, id, ...other } = data;
                //prepare data
                let preparedData = normalizeSelectValues(other, [
                    // "company_id",
                    "parent_branch_id",
                ]);
                //set to api
                const response = await branchUpdate({
                    id,
                    credentials: preparedData,
                }).unwrap();

                if (response) {
                    toast.success("Branch Update Successfully");
                    refetch();
                    formReset(form);

                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                // set server site single errors
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onDelete: async (id) => {
            try {
                if (confirm("Are you sure you want to delete this branch?")) {
                    const response = await branchDelete({ id });

                    if (response?.data?.success) {
                        toast.success("Branch deleted successfully");
                        refetch();
                    } else if (response?.error?.data?.errors?.message) {
                        toast.error(response?.error?.data?.errors?.message);
                    } else {
                        toast.error(
                            "Failed to delete branch. Please try again."
                        );
                    }
                }
            } catch (error) {
                console.error("Delete branch error:", error);

                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong while deleting branch.");
                }
            }
        },
        onSearch: debounce(async (inputValue, callback) => {
            form.setValue("search", inputValue);
            let res = branchSearchResult?.data?.branches || [];
            callback(branchSearchTemplate(res));
        }, 500),
    };

    return {
        actions,
        branchesState,
    };
};
