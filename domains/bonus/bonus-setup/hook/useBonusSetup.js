import {
    handleServerValidationErrors,
    formReset,
    prepareFilterPayload,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    branchSearchTemplate,
    departmentSearchTemplate,
    jobPositionsTemplate,
    leaveTypeSearchTemplate,
} from "@/utility/templateHelper";
import {
    useCreateBonusSetupMutation,
    useUpdateBonusSetupMutation,
    useDeleteBonusSetupMutation,
    useFetchBonusSetupsQuery,
} from "../services/bonusSetupApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useBonusSetup = () => {
    const router = useRouter();
    const [createBonusSetup] = useCreateBonusSetupMutation();
    const [updateBonusSetup] = useUpdateBonusSetupMutation();
    const [deleteBonusSetup] = useDeleteBonusSetupMutation();
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };
    const {
        data: bonusSetupData,
        refetch,
        isFetching,
    } = useFetchBonusSetupsQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const defaultValue = {
        status: "active",
        min_days: 0,
        max_days: null,
        bonus_percentage: 0,
        company_project_wise: "company",
    };

    const bonusSetupState = {
        data: bonusSetupData?.data?.bonus_setups || [],
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: bonusSetupData?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onFilter: async () => {
            const values = form.getValues();
            const payload = prepareFilterPayload(values, searchParams);
            setFilters(payload);
            router.push(`${pathname}`);
            refetch();
        },

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
                const { openModel, ...payload } = data;
                const prepared = normalizeSelectValues(payload, [
                    "branch_id",
                    "department_id",
                    "job_position_id",
                    "bonus_type_id",
                    "project_id",
                ]);
                await createBonusSetup(prepared).unwrap();
                toast.success("Bonus setup created successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create bonus setup");
            }
        },

        onEdit: (item) => {
            const branchId = item.branch_id || "";
            form.reset({
                id: item.id || "",
                branch_id: branchSearchTemplate(item?.branch ? [item.branch] : [])?.at(0) ?? null,
                department_id: departmentSearchTemplate(item?.department ? [item.department] : [])?.at(0) ?? null,
                job_position_id: jobPositionsTemplate(item?.job_position ? [item.job_position] : [])?.at(0) ?? null,
                project_id: item.project_id
                    ? { value: item.project?.id ?? item.project_id, label: item.project?.name ?? "Project" }
                    : null,
                company_project_wise: branchId ? "company" : "project",
                min_days: item.min_days ?? 0,
                max_days: item.max_days ?? "",
                bonus_percentage: item.bonus_percentage ?? 0,
                amount: item.amount ?? "",
                bonus_type_id: leaveTypeSearchTemplate(item?.bonus_type ? [item.bonus_type] : [])?.at(0) ?? null,
                bonus_name: item.bonus_name || "",
                year: item.year ?? "",
                month: item.month ?? "",
                status: item.status || "active",
                openModel: true,
            });
            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;
                const prepared = normalizeSelectValues(payload, [
                    "branch_id",
                    "department_id",
                    "job_position_id",
                    "bonus_type_id",
                    "project_id",
                ]);
                await updateBonusSetup({ id, ...prepared }).unwrap();
                toast.success("Bonus setup updated successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update bonus setup");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this bonus setup?"))
                    return;
                await deleteBonusSetup(id).unwrap();
                toast.success("Bonus setup deleted successfully");
                refetch();
            } catch (error) {
                const apiMessage =
                    error?.data?.errors?.error ||
                    error?.data?.message ||
                    "Something went wrong while deleting bonus setup.";
                toast.error(apiMessage);
            }
        },
    };

    return {
        actions,
        bonusSetupState,
    };
};
