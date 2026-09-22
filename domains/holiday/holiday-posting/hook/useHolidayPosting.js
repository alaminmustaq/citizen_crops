import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    holidayTypeSearchTemplate,
    holidayReasonSearchTemplate,
    branchSearchTemplate,
    projectTemplate,
    departmentSearchTemplate,
} from "@/utility/templateHelper";
import {
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
    useDeleteGroupHolidayMutation,
    useApproveHolidayMutation,
    useFetchHolidayQuery,
} from "../services/holidayPostingApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";


export const useHolidayPosting = () => {
    const [skippedEmployeesModal, setSkippedEmployeesModal] = useState({
        open: false,
        data: [],
    });

     const router = useRouter();

    const [createHoliday] = useCreateHolidayMutation();
    const [updateHoliday] = useUpdateHolidayMutation();
    const [deleteHoliday] = useDeleteHolidayMutation();
    const [deleteGroupHoliday] = useDeleteGroupHolidayMutation();
    const [approveHoliday] = useApproveHolidayMutation();
    // For Filters
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };
    const { data: holidayData, refetch, isFetching } = useFetchHolidayQuery({ params: queryParams });

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

    const defaultValue = {
        // status: "active",
    };

    const holidayState = {
        data: holidayData?.data?.holidays || [],
        form: {
            ...form,
            fields: fieldArray,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: holidayData?.data?.pagination || {},
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
        // Utility function to format date
        formatDateForForm: (dateString) => {
            if (!dateString) return "";
            try {
                const date = new Date(dateString); // create date from your string
                date.setDate(date.getDate() + 1); // add 1 day
                return date.toISOString().split("T")[0]; // format as YYYY-MM-DD
            } catch (error) {
                console.error("Date formatting error:", error);
                return "";
            }
        },
        onView: (item) => {
            setViewState({
                open: true,
                data: item,
            });
        },
        onCreate: async (data) => {
            // Group delete
            if (form.watch("model_for") == "delete_group_holiday") {
                try {
                    if (
                        !confirm(
                            "Are you sure you want to delete this holiday?",
                        )
                    )
                        return;

                    const { openModel, selectedId, ...payload } = data;

                    // ✅ Normalize EVERYTHING
                    const preparedData = Object.fromEntries(
                        Object.entries(payload).map(([key, value]) => [
                            key,
                            normalizeFieldValueRecursive(value),
                        ]),
                    );

                    // ✅ Handle "Other" reason
                    if (preparedData.reason_id === "other") {
                        preparedData.reason_id = null;
                    }
                    preparedData.employee_ids = Array.from(selectedId || []);

                    const response =
                        await deleteGroupHoliday(preparedData).unwrap();

                    if (response) {
                        toast.success("Group Holiday deleted successfully");
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                } catch (error) {
                    console.error("Delete holiday error:", error);

                    const message =
                        error?.data?.message ||
                        error?.message ||
                        "Something went wrong while deleting holiday.";

                    toast.error(message);
                }
            }
            // Create
            else {
                try {
                    const { openModel, selectedId, ...payload } = data;

                    // Normalize all fields (recursive version if needed)
                    const preparedData = normalizeFieldValueRecursive(payload);

                    // Handle "Other" reason
                    if (preparedData.reason_id === "other") {
                        preparedData.reason_id = null;
                    }

                    // Include selectedId if needed
                    preparedData.employee_ids = Array.from(selectedId || []);

                    // Call the API
                    const response = await createHoliday(preparedData).unwrap();

                    if (response) {
                        const payload = response.data || response;
                        const skippedCount = payload.skipped_count || 0;
                        const skippedEmployees =
                            payload.skipped_employees || [];

                        // Show skipped employees modal if any
                        if (skippedCount > 0 && skippedEmployees.length > 0) {
                            setSkippedEmployeesModal({
                                open: true,
                                data: skippedEmployees,
                            });
                        }

                        // Success toast
                        toast.success(
                            skippedCount > 0
                                ? `Holiday created successfully. ${payload.processed_count || 0} processed, ${skippedCount} skipped.`
                                : "Holiday created successfully",
                        );

                        // Reset form
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                } catch (apiErrors) {
                    handleServerValidationErrors(apiErrors, form.setError);
                    toast.error("Failed to create holiday");
                }
            }
        },

        onEdit: (item) => {  
            form.reset({
                id: item.id || "",
                start_date: actions.formatDateForForm(item.start_date) || "",
                end_date: actions.formatDateForForm(item.end_date) || "",
                type: item.project_id ? "project_holiday" : "company_holiday",
                holiday_type_id:
                    holidayTypeSearchTemplate(
                        item?.holiday_type ? [item?.holiday_type] : [],
                    )?.at(0) ?? null,

                branch_id:
                    branchSearchTemplate(
                        item?.branch ? [item?.branch] : [],
                    )?.at(0) ?? null,

                project_id:
                    projectTemplate(item?.project ? [item?.project] : [])?.at(
                        0,
                    ) ?? null,

                department_id:
                    departmentSearchTemplate(
                        item?.department ? [item?.department] : [],
                    )?.at(0) ?? null,

                employee_ids: item.employee_ids || [], // multi-select support

                reason_id: item.reason_id
                    ? (holidayReasonSearchTemplate([item.reason])?.at(0) ??
                      null)
                    : item.other_reason
                      ? { label: "Other", value: "other" } // show Other if only other_reason exists
                      : null,
                other_reason: item.other_reason || "",

                note: item.note || "",

                openModel: true,
                mode: "edit", // 🔑 editable mode
            });

            form.setValue("openModel", true);
        },

        onView: (item) => {
            form.reset({
                id: item.id || "",

                start_date: actions.formatDateForForm(item.start_date) || "",
                end_date: actions.formatDateForForm(item.end_date) || "",

                type:
                    item.type === "single"
                        ? item.project_id
                            ? "single_project_holiday"
                            : "single_holiday"
                        : item.type || "",

                holiday_type_id:
                    holidayTypeSearchTemplate(
                        item?.holiday_type ? [item.holiday_type] : [],
                    )?.at(0) ?? null,

                branch_id:
                    branchSearchTemplate(item?.branch ? [item.branch] : [])?.at(
                        0,
                    ) ?? null,

                project_id:
                    projectTemplate(item?.project ? [item.project] : [])?.at(
                        0,
                    ) ?? null,

                department_id: item.department_id || null,

                employee_ids: item.employee_ids || [],

                reason_id: item.reason_id
                    ? (holidayReasonSearchTemplate([item.reason])?.at(0) ??
                      null)
                    : item.other_reason
                      ? { label: "Other", value: "other" }
                      : null,

                other_reason: item.other_reason || "",
                remarks: item.remarks || "",

                openModel: true,
                mode: "view", // 🔑 view-only mode
            });

            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;

                // ✅ Normalize EVERYTHING (same as create)
                const preparedData = Object.fromEntries(
                    Object.entries(payload).map(([key, value]) => [
                        key,
                        normalizeFieldValueRecursive(value),
                    ]),
                );

                // ✅ Handle "Other" reason
                if (preparedData.reason_id === "other") {
                    preparedData.reason_id = null;
                }

                const response = await updateHoliday({
                    id,
                    ...preparedData,
                }).unwrap();

                if (response) {
                    const payload = response.data || response;

                    const skippedCount = payload.skipped_count || 0;
                    const skippedEmployees = payload.skipped_employees || [];

                    // 🔥 Show skipped employees modal if rejected
                    if (skippedCount > 0 && skippedEmployees.length > 0) {
                        setSkippedEmployeesModal({
                            open: true,
                            data: skippedEmployees,
                        });
                    }

                    // ✅ Context-aware toast
                    toast.success(
                        skippedCount > 0
                            ? `Holiday updated. ${payload.processed_count || 0} approved, ${skippedCount} rejected.`
                            : "Holiday updated successfully",
                    );

                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update holiday");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this holiday?"))
                    return;

                const response = await deleteHoliday(id).unwrap();

                if (response) {
                    toast.success("Holiday deleted successfully");
                    refetch();
                }
            } catch (error) {
                console.error("Delete holiday error:", error);

                const message =
                    error?.data?.message ||
                    error?.message ||
                    "Something went wrong while deleting holiday.";

                toast.error(message);
            }
        },

        onHolidayPosting: async () => {
            form.reset({ openModel: true, ...defaultValue });
        },
        onDeleteGroupApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "delete_group_holiday",
                ...defaultValue,
            });
        },

        onApproveSingleApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "approve_single_holiday",
                ...defaultValue,
            });
        },
        onCloseSkippedModal: () => {
            setSkippedEmployeesModal({
                open: false,
                data: [],
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
            // For nested objects
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
        holidayState,
        skippedEmployeesModal,
    };
};
