import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    branchSearchTemplate,
    projectTemplate,
    departmentSearchTemplate,
    employeeTypeSearchTemplate,
    shiftSearchTemplate,
} from "@/utility/templateHelper";
import {
    useCreateScheduleMutation,
    useUpdateScheduleMutation,
    useDeleteScheduleMutation,
    useDeleteGroupScheduleMutation,
    useApproveScheduleMutation,
    useFetchScheduleQuery,
} from "../services/scheduleSetupApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useScheduleSetup = () => {
    const router = useRouter();
    const [createSchedule] = useCreateScheduleMutation();
    const [updateSchedule] = useUpdateScheduleMutation();
    const [deleteSchedule] = useDeleteScheduleMutation();
    const [deleteGroupSchedule] = useDeleteGroupScheduleMutation();
    const [approveSchedule] = useApproveScheduleMutation();
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
        data: scheduleData,
        refetch,
        isFetching,
    } = useFetchScheduleQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            employee_details: [],
        },
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "employee_details",
    });

    const defaultValue = {};

    const scheduleState = {
        data: scheduleData?.data?.schedules || [],
        form: {
            ...form,
            fields: fieldArray,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: scheduleData?.data?.pagination || {},
        isFetching,
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
        formatDateForForm: (dateString) => {
            if (!dateString) return "";
            try {
                const date = new Date(dateString);
                date.setDate(date.getDate() + 1);
                return date.toISOString().split("T")[0];
            } catch (error) {
                console.error("Date formatting error:", error);
                return "";
            }
        },

        onCreate: async (data) => {
            try {
                const { openModel, selectedId, ...payload } = data;

                // Normalize all fields recursively
                const preparedData = normalizeFieldValueRecursive(payload);

                // Handle "Other" reason
                if (preparedData.reason_id === "other") {
                    preparedData.reason_id = null;
                }

                // Include selectedId if needed
                preparedData.employee_ids = Array.from(selectedId || []);

                // Call API
                await createSchedule(preparedData).unwrap();

                toast.success("Schedule created successfully");

                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create schedule");
            }
        },

        onEdit: (item) => {
            form.reset({
                id: item.id || "",
                type: item.project_id ? "project" : "company", // simplified type
                employee_type_id: item.employee_type_id || null,
                shift_id: item.shift_id || null,
                company_id: item.company_id || null,
                branch_id: item.branch
                    ? (branchSearchTemplate([item.branch])?.at(0) ?? null)
                    : null,
                department_id: item.department
                    ? (departmentSearchTemplate([item.department])?.at(0) ??
                      null)
                    : null,
                employee_type_id: item.employee_type
                    ? (employeeTypeSearchTemplate([item.employee_type])?.at(
                          0,
                      ) ?? null)
                    : null,
                shift_id: item.shift
                    ? (shiftSearchTemplate([item.shift])?.at(0) ?? null)
                    : null,
                project_id: item.project
                    ? (projectTemplate([item.project])?.at(0) ?? null)
                    : null,
                in_time: item.in_time || "",
                late_time: item.late_time || "",
                last_in_time: item.last_in_time || "",
                break_time_start: item.break_time_start || "",
                break_time_end: item.break_time_end || "",
                out_time: item.out_time || "",
                overtime_status: item.overtime_status ?? false,
                openModel: true,
                mode: "edit",
            });

            form.setValue("openModel", true);
        },

        onView: (item) => {
            form.reset({
                id: item.id || "",
                type: item.project_id ? "project" : "company",
                employee_type_id: item.employee_type_id || null,
                shift_id: item.shift_id || null,
                company_id: item.company_id || null,
                branch_id: item.branch
                    ? (branchSearchTemplate([item.branch])?.at(0) ?? null)
                    : null,
                department_id: item.department
                    ? (departmentSearchTemplate([item.department])?.at(0) ??
                      null)
                    : null,
                employee_type_id: item.employee_type
                    ? (employeeTypeSearchTemplate([item.employee_type])?.at(
                          0,
                      ) ?? null)
                    : null,
                shift_id: item.shift
                    ? (shiftSearchTemplate([item.shift])?.at(0) ?? null)
                    : null,
                project_id: item.project
                    ? (projectTemplate([item.project])?.at(0) ?? null)
                    : null,
                in_time: item.in_time || "",
                late_time: item.late_time || "",
                last_in_time: item.last_in_time || "",
                break_time_start: item.break_time_start || "",
                break_time_end: item.break_time_end || "",
                out_time: item.out_time || "",
                overtime_status: item.overtime_status ?? false,
                openModel: true,
                mode: "view",
            });

            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;

                const preparedData = Object.fromEntries(
                    Object.entries(payload).map(([key, value]) => [
                        key,
                        normalizeFieldValueRecursive(value),
                    ]),
                );

                if (preparedData.reason_id === "other") {
                    preparedData.reason_id = null;
                }

                await updateSchedule({ id, ...preparedData }).unwrap();

                toast.success("Schedule updated successfully");

                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update schedule");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this schedule?"))
                    return;

                await deleteSchedule(id).unwrap();

                toast.success("Schedule deleted successfully");
                refetch();
            } catch (error) {
                console.error("Delete schedule error:", error);
                toast.error(
                    error?.data?.message ||
                        error?.message ||
                        "Something went wrong while deleting schedule.",
                );
            }
        },

        onScheduleSetup: async () => {
            form.reset({ openModel: true, ...defaultValue });
        },

        onDeleteGroupApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "delete_group_schedule",
                ...defaultValue,
            });
        },

        onApproveSingleApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "approve_single_schedule",
                ...defaultValue,
            });
        },
    };

    const normalizeFieldValueRecursive = (value) => {
        if (Array.isArray(value)) {
            return value.map(normalizeFieldValueRecursive);
        }
        if (value instanceof Set) {
            return Array.from(value).map(normalizeFieldValueRecursive);
        }
        if (typeof value === "object" && value !== null) {
            if (
                "value" in value &&
                Object.keys(value).length === 2 &&
                "label" in value
            ) {
                return value.value;
            }
            return Object.fromEntries(
                Object.entries(value).map(([k, v]) => [
                    k,
                    normalizeFieldValueRecursive(v),
                ]),
            );
        }
        return value;
    };

    return {
        actions,
        scheduleState,
    };
};
