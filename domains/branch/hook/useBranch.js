import {
    handleServerValidationErrors,
    handleServerValidationErrorsToast,
    prepareFilterPayload,
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
import useAuth from "@/domains/auth/hooks/useAuth";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useBranch = () => {
    const router = useRouter();
    const [branchCreate, { isLoading: isCreating }] = useBranchCreateMutation();
    const [branchUpdate, { isLoading: isUpdating }] = useBranchUpdateMutation();
    const [branchDelete, { isLoading: isDeleting }] = useBranchDeleteMutation();
    // For Filters
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };
    const {
        data: branch,
        refetch,
        isFetching,
    } = useBranchFetchQuery({ params: queryParams });
    const { loginAsBranch } = useAuth();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });
    const defaultValue = {
        status: "active",
        type: "branch",
        branch_type: "branch_office",
        hierarchy_level: 1,
        sort_order: 0,
    };

    const { data: branchSearchResult } = useBranchSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") }, // skip query if empty
    );

    const branchesState = {
        data: branch?.data?.branches || [],
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: branch?.data?.pagination || {},
        isFetching,
        isMutating: isCreating || isUpdating || isDeleting,
    };

    const actions = {
        //  FILTER
        onFilter: async () => {
            const values = form.getValues();
            const payload = prepareFilterPayload(values, searchParams);

            setFilters(payload);

            const params = new URLSearchParams({ page: "1" });

            Object.entries(payload).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => params.append(`${key}[]`, v));
                } else {
                    params.set(key, value);
                }
            });

            router.push(`${pathname}`);
            refetch();
        },

        //  RESET
        onReset: async () => {
            const resetValues = Object.fromEntries(
                Object.entries(form.getValues()).map(([key, value]) => [
                    key,
                    Array.isArray(value) ? [] : "",
                ]),
            );

            form.reset(resetValues);
            setFilters({});
            await form.trigger();
            refetch();
        },
        onCreate: async (data) => {
            try {
                let { openModel, ...other } = data;
                let preparedData = normalizeSelectValues(other, [
                    // "company_id",
                    "parent_branch_id",
                ]);

                const response = await branchCreate(preparedData).unwrap();

                if (response.success) {
                    toast.success("Branch Created Successfully");
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
                // IDs
                id: data.id || "",
                parent_branch_id:
                    branchSearchTemplate(
                        data?.parent_branch ? [data.parent_branch] : [],
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
                    toast.success("Branch Updated Successfully");
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
                            "Failed to delete branch. Please try again.",
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
        onLoginAsBranch: async (data) => {
            console.log(data);

            const res = await loginAsBranch(data);

            if (res.success) {
                toast.success("Login as Branch successfully");

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            }
        },
    };

    return {
        actions,
        branchesState,
    };
};
