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
    jobPositionsTemplate,
} from "@/utility/templateHelper";
import {
    useCreateEarningDeductionMutation,
    useUpdateEarningDeductionMutation,
    useDeleteEarningDeductionMutation,
    useDeleteGroupEarningDeductionMutation, 
    useFetchEarningDeductionQuery,
} from "../services/earningDeductionApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";


export const useEarningDeduction = () => {
    const [skippedEmployeesModal, setSkippedEmployeesModal] = useState({
        open: false,
        data: [],
    });

     const router = useRouter();

    const [createEarningDeduction] = useCreateEarningDeductionMutation();
    const [updateEarningDeduction] = useUpdateEarningDeductionMutation();
    const [deleteEarningDeduction] = useDeleteEarningDeductionMutation();
    const [deleteGroupEarningDeduction] = useDeleteGroupEarningDeductionMutation(); 
    // For Filters
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };
    const { data: earningDeductionData, refetch, isFetching } = useFetchEarningDeductionQuery({ params: queryParams });

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

    const earningDeductionState = {
        data: earningDeductionData?.data?.items || [],
        form: {
            ...form,
            fields: fieldArray,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: earningDeductionData?.data?.pagination || {},
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
            if (form.watch("model_for") == "delete_group_earning_deduction") {
                try {
                    if (
                        !confirm(
                            "Are you sure you want to delete this earning/deduction?",
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
                        await deleteGroupEarningDeduction(preparedData).unwrap();

                    if (response) {
                        toast.success("Group EarningDeduction deleted successfully");
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                } catch (error) {
                    console.error("Delete earning/deduction error:", error);

                    const message =
                        error?.data?.message ||
                        error?.message ||
                        "Something went wrong while deleting earning/deduction.";

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
                    const response = await createEarningDeduction(preparedData).unwrap();

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
                                ? `EarningDeduction created successfully. ${payload.processed_count || 0} processed, ${skippedCount} skipped.`
                                : "EarningDeduction created successfully",
                        );

                        // Reset form
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                } catch (apiErrors) {
                    handleServerValidationErrors(apiErrors, form.setError);
                    toast.error("Failed to create earning/deduction");
                }
            }
        },

        onEdit: (item) => {
            console.log("Editing item:", item);

            // Reset the form with main fields only
            form.reset({
                id: item.id || "", // ✅ include the ID
                type: item.allowance_type?.type || "earning",
                allowance_type_id: holidayTypeSearchTemplate(
                    item?.allowance_type ? [item?.allowance_type] : []
                )?.at(0) ?? null,
                scope_type: item.project_id ? "project" : "company",
                branch_id: branchSearchTemplate(item?.branch ? [item?.branch] : [])?.at(0) ?? null,
                department_id: departmentSearchTemplate(item?.department ? [item?.department] : [])?.at(0) ?? null,
                project_id: projectTemplate(item?.project ? [item?.project] : [])?.at(0) ?? null,
                job_position_id: jobPositionsTemplate(item?.job_position ? [item?.job_position] : [])?.at(0) ?? null,
                amount: item.amount || 0,
                status: item.status === 1 ? "active" : "inactive",
                user_type: "responsible",
                employee_user_type: "assigned",
                mode: "edit",
                openModel: true,
            });

            // Make sure the modal is open
            form.setValue("openModel", true);
        },

        onView: (item) => {
            form.reset({
                id: item.id || "",

                start_date: actions.formatDateForForm(item.start_date) || "",
                end_date: actions.formatDateForForm(item.end_date) || "",

                scope_type:
                    item.scope_type === "single"
                        ? item.project_id
                            ? "single_project_holiday"
                            : "single_holiday"
                        : item.scope_type || "",

                allowance_type_id:
                    holidayTypeSearchTemplate(
                        item?.allowance_type ? [item.allowance_type] : [],
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
            console.log("RAW FORM DATA:", data);

            try {
                const { openModel, mode, ...rest } = data; // ❌ don't send UI fields

                // ✅ Deep normalize first
                const normalized = Object.fromEntries(
                    Object.entries(rest).map(([key, value]) => [
                        key,
                        normalizeFieldValueRecursive(value),
                    ])
                );

                console.log("AFTER NORMALIZE:", normalized);

                console.log(normalized.department_id);
                
                // ================================
                // 🎯 EXTRACT IDS FROM SELECTS
                // ================================
                const preparedData = {
                    ...normalized,

                    allowance_type_id: normalized.allowance_type_id?.value ?? normalized.allowance_type_id ?? null,
                    branch_id: normalized.branch_id?.value ?? normalized.branch_id ?? null,
                    department_id: normalized.department_id ? normalized.department_id : null,
                    job_position_id: normalized.job_position_id?.value ?? normalized.job_position_id ?? null,
                    project_id: normalized.project_id?.value ?? normalized.project_id ?? null,
                };

                // ================================
                // 🔢 FIX TYPES
                // ================================
                preparedData.amount = Number(preparedData.amount) || 0;

                // status → backend expects number
                if (preparedData.status === "active") preparedData.status = 1;
                else if (preparedData.status === "inactive") preparedData.status = 0;

                // ================================
                // 🧹 REMOVE FIELDS NOT ALLOWED IN COMPANY SCOPE
                // ================================
                // if (preparedData.scope_type === "company") {
                //     preparedData.department_id = null;
                //     preparedData.job_position_id = null;
                //     preparedData.project_id = null;
                // }

                console.log("FINAL PAYLOAD:", preparedData);

                // ================================
                // 🚀 API CALL
                // ================================
                const response = await updateEarningDeduction({
                    id: normalized.id,
                    ...preparedData,
                }).unwrap();

                const payload = response.data || response;
                const skippedCount = payload.skipped_count || 0;
                const skippedEmployees = payload.skipped_employees || [];

                if (skippedCount > 0 && skippedEmployees.length > 0) {
                    setSkippedEmployeesModal({
                        open: true,
                        data: skippedEmployees,
                    });
                }

                toast.success(
                    skippedCount > 0
                        ? `Updated. ${payload.processed_count || 0} approved, ${skippedCount} rejected.`
                        : "Earning/Deduction updated successfully"
                );

                refetch();
                formReset(form);
                form.setValue("openModel", false);

            } catch (apiErrors) {
                console.error(apiErrors);
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update earning / deduction");
            }
        },


        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this earning / deduction?"))
                    return;

                const response = await deleteEarningDeduction(id).unwrap();

                if (response) {
                    toast.success("EarningDeduction deleted successfully");
                    refetch();
                }
            } catch (error) {
                console.error("Delete earning / deduction error:", error);

                const message =
                    error?.data?.message ||
                    error?.message ||
                    "Something went wrong while deleting earning / deduction.";

                toast.error(message);
            }
        },

        onEarningDeduction: async () => {
            form.reset({ openModel: true, ...defaultValue });
        },
        onDeleteGroupApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "delete_group_earning_deduction",
                ...defaultValue,
            });
        },

        onApproveSingleApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "approve_single_earning_deduction",
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
        earningDeductionState,
        skippedEmployeesModal,
    };
};
