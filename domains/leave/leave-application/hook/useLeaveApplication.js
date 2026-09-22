import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
     prepareFilterPayload,
} from "@/utility/helpers";
import {
    leaveTypeSearchTemplate,
    leaveReasonSearchTemplate,
    branchSearchTemplate,
    projectTemplate,
} from "@/utility/templateHelper";
import {
    useCreateLeaveMutation,
    useUpdateLeaveMutation,
    useDeleteLeaveMutation,
    useDeleteGroupLeaveMutation,
    useApproveLeaveMutation,
    useFetchLeaveQuery,
} from "../services/leaveApplicationApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Cookies from "js-cookie";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useLeaveApplication = () => {
      const router = useRouter();
    const [skippedEmployeesModal, setSkippedEmployeesModal] = useState({
        open: false,
        data: [],
    });
    const [createLeave] = useCreateLeaveMutation();
    const [updateLeave] = useUpdateLeaveMutation();
    const [deleteLeave] = useDeleteLeaveMutation();
    const [deleteGroupLeave] = useDeleteGroupLeaveMutation();
    const [approveLeave] = useApproveLeaveMutation();

     // For Filters
            const [filters, setFilters] = useState({});
            const pathname = usePathname();
            const searchParams = useSearchParams();
            const pageFromUrl = searchParams.get("page") || "1";
            const queryParams = {
                ...filters,
                ...(pageFromUrl ? { page: pageFromUrl } : {}),
            };
    
    const { data: leaveData, refetch, isFetching } = useFetchLeaveQuery({ params: queryParams });

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
        status: "active",
    };

    const leaveState = {
        data: leaveData?.data?.leave_details || [],
        form: {
            ...form,
            fields: fieldArray,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: leaveData?.data?.pagination || {},
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
            if (form.watch("model_for") == "delete_group_leave") {
                try {
                    if (!confirm("Are you sure you want to delete this leave?"))
                        return;

                    const { openModel, selectedId, ...payload } = data;

                    // ✅ Normalize EVERYTHING
                    const preparedData = Object.fromEntries(
                        Object.entries(payload).map(([key, value]) => [
                            key,
                            normalizeFieldValueRecursive(value),
                        ])
                    );

                    // ✅ Handle "Other" reason
                    if (preparedData.reason_id === "other") {
                        preparedData.reason_id = null;
                    }
                    preparedData.employee_ids = Array.from(selectedId || []);

                    const response = await deleteGroupLeave(
                        preparedData
                    ).unwrap();

                    if (response) {
                        toast.success("Group Leave deleted successfully");
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                } catch (error) {
                    console.error("Delete leave error:", error);

                    const message =
                        error?.data?.message ||
                        error?.message ||
                        "Something went wrong while deleting leave.";

                    toast.error(message);
                }
            }
            // Approve
            else if (form.watch("model_for") === "approve_single_leave") {
                try {
                    const { openModel, ...payload } = data;

                    //  Normalize EVERYTHING
                    const preparedData = Object.fromEntries(
                        Object.entries(payload).map(([key, value]) => [
                            key,
                            normalizeFieldValueRecursive(value),
                        ])
                    );

                    const response = await approveLeave(preparedData).unwrap();

                    if (response) {
                        const payload = response.data || response;

                        const skippedCount = payload.skipped_count || 0;
                        const skippedEmployees =
                            payload.skipped_employees || [];

                        //  SAME behavior as single leave create
                        if (skippedCount > 0 && skippedEmployees.length > 0) {
                            setSkippedEmployeesModal({
                                open: true,
                                data: skippedEmployees,
                            });
                        }

                        toast.success(
                            skippedCount > 0
                                ? `Leave approved successfully. ${
                                      payload.approved_count || 0
                                  } approved, ${skippedCount} skipped.`
                                : "Leave approved successfully"
                        );

                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                } catch (apiErrors) {
                    console.log(apiErrors);
                    handleServerValidationErrors(apiErrors, form.setError);
                    toast.error("Failed to approve leave");
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

                    const requestBody = buildLeavePayload(preparedData);
                    const response = await createLeave(requestBody).unwrap();

                    if (response) {
                        const payload = response.data || response;
                        const skippedCount = payload.skipped_count || 0;
                        const skippedEmployees =
                            payload.skipped_employees || [];

                        if (skippedCount > 0 && skippedEmployees.length > 0) {
                            setSkippedEmployeesModal({
                                open: true,
                                data: skippedEmployees,
                            });
                        }
                        toast.success(
                            skippedCount > 0
                                ? `Leave created successfully. ${
                                      payload.processed_count || 0
                                  } processed, ${skippedCount} skipped.`
                                : "Leave created successfully"
                        );
                        refetch();
                        formReset(form);
                        form.setValue("openModel", false);
                    }
                } catch (apiErrors) {
                    handleServerValidationErrors(apiErrors, form.setError);
                    toast.error("Failed to create leave");
                }
            }
        },

        onEdit: (item) => {
            form.reset({
                id: item.id || "",
                start_date: actions.formatDateForForm(item.start_date) || "",
                end_date: actions.formatDateForForm(item.end_date) || "",
                type:
                    item.type === "single"
                        ? item.project_id
                            ? "single_project_leave"
                            : "single_leave"
                        : item.type || "",
                leave_type_id:
                    leaveTypeSearchTemplate(
                        item?.leave_type ? [item?.leave_type] : []
                    )?.at(0) ?? null,

                branch_id:
                    branchSearchTemplate(
                        item?.branch ? [item?.branch] : []
                    )?.at(0) ?? null,

                project_id:
                    projectTemplate(item?.project ? [item?.project] : [])?.at(
                        0
                    ) ?? null,

                department_id: item.department_id || "",

                employee_ids: item.employee_ids || [], // multi-select support

                reason_id: item.reason_id
                    ? leaveReasonSearchTemplate([item.reason])?.at(0) ?? null
                    : item.other_reason
                    ? { label: "Other", value: "other" } // show Other if only other_reason exists
                    : null,
                other_reason: item.other_reason || "",

                remarks: item.remarks || "",
                application_file: item.application_file_url || "",

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
                            ? "single_project_leave"
                            : "single_leave"
                        : item.type || "",

                leave_type_id:
                    leaveTypeSearchTemplate(
                        item?.leave_type ? [item.leave_type] : []
                    )?.at(0) ?? null,

                branch_id:
                    branchSearchTemplate(item?.branch ? [item.branch] : [])?.at(
                        0
                    ) ?? null,

                project_id:
                    projectTemplate(item?.project ? [item.project] : [])?.at(
                        0
                    ) ?? null,

                department_id: item.department_id || null,

                employee_ids: item.employee_ids || [],

                reason_id: item.reason_id
                    ? leaveReasonSearchTemplate([item.reason])?.at(0) ?? null
                    : item.other_reason
                    ? { label: "Other", value: "other" }
                    : null,

                other_reason: item.other_reason || "",
                remarks: item.remarks || "",
                application_file: item.application_file_url || "",

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
                    ])
                );

                // ✅ Handle "Other" reason
                if (preparedData.reason_id === "other") {
                    preparedData.reason_id = null;
                }

                const requestBody = buildLeavePayload(preparedData);
                const response = await updateLeave(
                    requestBody instanceof FormData
                        ? { id, body: requestBody }
                        : { id, ...requestBody },
                ).unwrap();

                if (response) {
                    toast.success("Leave updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update leave");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this leave?"))
                    return;

                const response = await deleteLeave(id).unwrap();

                if (response) {
                    toast.success("Leave deleted successfully");
                    refetch();
                }
            } catch (error) {
                console.error("Delete leave error:", error);

                const message =
                    error?.data?.message ||
                    error?.message ||
                    "Something went wrong while deleting leave.";

                toast.error(message);
            }
        },

        onViewFile: async (item) => {
            try {
                if (!item?.application_file_url) {
                    toast.error("No leave application file found");
                    return;
                }

                const token =
                    Cookies.get("auth-token") ||
                    (typeof window !== "undefined"
                        ? localStorage.getItem("token")
                        : null);

                const response = await fetch(item.application_file_url, {
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`,
                              Accept: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*",
                          }
                        : {},
                });

                if (!response.ok) {
                    throw new Error("Failed to load leave application file");
                }

                const blob = await response.blob();
                const fileUrl = URL.createObjectURL(blob);
                window.open(fileUrl, "_blank", "noopener,noreferrer");
                setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
            } catch (error) {
                toast.error(error?.message || "Failed to open file");
            }
        },

        onViewCurrentFile: async () => {
            const applicationFileUrl = form.getValues("application_file");

            await actions.onViewFile({
                application_file_url: applicationFileUrl,
            });
        },

        onLeaveApplication: async () => {
            form.reset({ openModel: true, ...defaultValue });
        },
        onDeleteGroupApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "delete_group_leave",
                ...defaultValue,
            });
        },

        onApproveSingleApplication: async () => {
            form.reset({
                openModel: true,
                model_for: "approve_single_leave",
                user_type: "responsible",
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
        if (value instanceof File) {
            return value;
        }
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
                ])
            );
        }
        return value;
    };

    const buildLeavePayload = (payload) => {
        if (!(payload.application_file instanceof File)) {
            const { application_file, ...payloadWithoutFile } = payload;
            return payloadWithoutFile;
        }

        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
            if (value == null || value === "") return;

            if (Array.isArray(value)) {
                value.forEach((item) => formData.append(`${key}[]`, item));
                return;
            }

            formData.append(key, value);
        });

        return formData;
    };

    return {
        actions,
        leaveState,
        skippedEmployeesModal,
    };
};
