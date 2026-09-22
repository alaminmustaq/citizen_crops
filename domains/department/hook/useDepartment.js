import { handleServerValidationErrors } from "@/utility/helpers";
import {
    useDepartmentCreateMutation,
    useDepartmentUpdateMutation,
    useDepartmentDeleteMutation,
    useDepartmentSearchQuery,
    useDepartmentFetchQuery,
} from "../services/departmentApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import { debounce } from "@/utility/helpers";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";
import {
    branchSearchTemplate,
    commonSearchTemplate,
    companySearchTemplate,
} from "@/utility/templateHelper";
import { getFilterParams } from "@/utility/helpers";
import { useMemo } from "react";
import { useAppSelector } from "@/hooks/use-redux";
import useAuth from "@/domains/auth/hooks/useAuth";

export const useDepartment = () => {
    const router = useRouter();
    const [departmentCreate, { isLoading: isCreating }] =
        useDepartmentCreateMutation();
    const [departmentUpdate, { isLoading: isUpdating }] =
        useDepartmentUpdateMutation();
    const [departmentDelete, { isLoading: isDeleting }] =
        useDepartmentDeleteMutation();
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
        data: department,
        refetch,
        isFetching,
    } = useDepartmentFetchQuery({ params: queryParams });

    const { user } = useAuth();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const defaultValue = {
        branch_id:
            branchSearchTemplate(
                user?.employee?.branch ? [user?.employee?.branch] : [],
            )?.at(0) ?? null,

        type: "department",
        status: "active",
    };

    const { data: departmentSearchResult } = useDepartmentSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") }, // skip query if empty
    );

    const departmentState = {
        data: department?.data?.departments || [],
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: department?.data?.pagination || {},
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
                    "branch_id",
                    "parent_department_id",
                ]);

                const response = await departmentCreate(preparedData).unwrap();
                if (response) {
                    toast.success("Department Created Successfully");
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
                branch_id:
                    branchSearchTemplate(data?.branch ? [data.branch] : [])?.at(
                        0,
                    ) ?? null,
                parent_department_id:
                    commonSearchTemplate(
                        data?.parent_department ? [data.parent_department] : [],
                    )?.at(0) ?? null,

                // Core
                name: data.name || "",
                code: data.code || "",
                description: data.description || "",
                department_type:
                    data?.operational_info?.department_type || "technical",
                type: data?.type || "department",

                // Hierarchy

                is_main_department: Boolean(
                    data?.hierarchy_info?.is_main_department,
                ),
                sort_order: data.sort_order ?? 0,

                // Contact
                email: data?.email || "",
                phone: data?.phone || "",
                extension: data.extension || "",

                is_billable: Boolean(data.is_billable),
                is_cost_center: Boolean(data.is_cost_center),

                // Manager / Heads
                head_of_department_id: data.head_of_department_id || "",
                deputy_head_id: data.deputy_head_id || "",

                // Finance / Cost center
                is_billable: Boolean(data.is_billable),
                is_cost_center: Boolean(data.is_cost_center),
                cost_center_code: data?.cost_center_code || "",
                budget_allocated:
                    data?.cost_center_info?.budget_allocated ?? "",
                budget_utilized: data?.cost_center_info?.budget_utilized ?? "",
                budget_remaining:
                    data?.cost_center_info?.budget_remaining ?? "",
                utilization_percentage:
                    data?.cost_center_info?.utilization_percentage ?? "",

                // Operational extras
                objectives: data?.operational_info?.objectives || "",
                functions: data?.operational_info?.functions || "",

                // Dates & numbers
                established_date: data?.system_info?.established_date || "",
                hierarchy_level: data?.hierarchy_info?.hierarchy_level ?? "",
                hierarchy_path: data.hierarchy_info.hierarchy_path,

                // System
                status: data?.system_info?.status || "inactive",
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
                    "branch_id",
                    "parent_department_id",
                ]);

                //set to api
                const response = await departmentUpdate({
                    id,
                    credentials: preparedData,
                }).unwrap();

                if (response) {
                    toast.success("Department Updated Successfully");
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
                if (
                    confirm("Are you sure you want to delete this Department?")
                ) {
                    const response = await departmentDelete({ id });

                    if (response?.data?.success) {
                        toast.success("Department Deleted Successfully");
                        refetch();
                    } else if (response?.error?.data?.errors?.message) {
                        toast.error(response?.error?.data?.errors?.message);
                    } else {
                        toast.error(
                            "Failed to delete department. Please try again.",
                        );
                    }
                }
            } catch (error) {
                console.error("Delete department error:", error);

                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "Something went wrong while deleting department.",
                    );
                }
            }
        },

        onSearch: debounce(async (inputValue, callback) => {
            form.setValue("search", inputValue);
            let res = departmentSearchResult?.data?.departments || [];
            callback(commonSearchTemplate(res));
        }, 500),
    };

    return {
        actions,
        departmentState,
    };
};
