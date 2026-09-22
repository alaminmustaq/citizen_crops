import {
    handleServerValidationErrors,
    formReset,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    branchSearchTemplate,
    projectTemplate,
    departmentSearchTemplate,
} from "@/utility/templateHelper";
import {
    useCreateAdvanceMutation,
    useUpdateAdvanceMutation,
    useDeleteAdvanceMutation,
    useDeleteGroupAdvanceMutation,
    useFetchAdvanceQuery,
} from "../services/advanceApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";

export const useAdvance = () => {
    const router = useRouter();

    const [createAdvance] = useCreateAdvanceMutation();
    const [updateAdvance] = useUpdateAdvanceMutation();
    const [deleteAdvance] = useDeleteAdvanceMutation();
    const [deleteGroupAdvance] = useDeleteGroupAdvanceMutation();
   
    // For Filters
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const searchFromUrl = searchParams.get("search") || "";

    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
        ...(searchFromUrl ? { search: searchFromUrl } : {}),
    };

    const {
        data: advanceData,
        refetch,
        isFetching,
    } = useFetchAdvanceQuery(queryParams);

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            employee_details: [],
            scope_type: "company",
            employee_type: "company",
        },
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "employee_details",
    });

    const advanceState = {
        data: advanceData?.data?.items || [], 
        form: {
            ...form,
            fields: fieldArray,
        },
        refetch,
        pagination: advanceData?.data?.pagination || {}, 
        isFetching,
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

            router.push(`${pathname}?${params.toString()}`);
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
            // remove query params
            router.push(`${pathname}`);
            await form.trigger();
            refetch();
        },
        
        onView: (item) => {
             form.reset({
                ...item,
                branch_id: branchSearchTemplate(item?.branch ? [item.branch] : [])?.at(0) ?? null,
                department_id: departmentSearchTemplate(item?.department ? [item.department] : [])?.at(0) ?? null,
                project_id: projectTemplate(item?.project ? [item.project] : [])?.at(0) ?? null,
                openModel: true,
                mode: "view",
            });
             form.setValue("openModel", true);
        },

        onCreate: async (data) => {
            try {
                const { openModel, mode, selectedId, ...payload } = data;

                // Normalize top-level fields (branch_id, project_id, etc)
                const normalized = normalizeFieldValueRecursive(payload);

                // Try to get IDs from selectedId (Set or Array)
                let employeeIds = Array.from(selectedId || []);

                // Robust fallback: If selectedId is empty, check is_selected in employee_details
                if (employeeIds.length === 0) {
                    employeeIds = (payload.employee_details || [])
                        .filter(emp => emp.is_selected)
                        .map(emp => emp.employee_id || emp.id)
                        .filter(Boolean);
                }

                // Prepare final payload for bulk store
                const finalPayload = {
                    ...normalized,
                    employee_ids: employeeIds,
                    employee_details: payload.employee_details
                };

                await createAdvance(finalPayload).unwrap();

                toast.success("Advance settings processed successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);

            } catch (apiErrors) {
                console.error("Create advance error:", apiErrors);
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create advance records");
            }
        },

        onEdit: (item) => {
            form.reset({
                id: item.id || "",
                branch_id: branchSearchTemplate(item?.branch ? [item.branch] : [])?.at(0) ?? null,
                department_id: departmentSearchTemplate(item?.department ? [item.department] : [])?.at(0) ?? null,
                project_id: projectTemplate(item?.project ? [item.project] : [])?.at(0) ?? null,
                
                amount: item.amount,
                advance_date: item.advance_date,
                month: item.month,
                year: item.year,
                status: item.status === 'active' || item.status === 1 ? 'active' : 'inactive',
                reason: item.reason,

                scope_type: item.project_id ? "project" : "company",
                employee_type: item.project_id ? "project" : "company",
                
                mode: "edit",
                openModel: true,
            });
            form.setValue("openModel", true);
        },

         onUpdate: async (data) => {
            try {
                const { openModel, mode, ...payload } = data;
                 
                // Normalize deep object/select structures
                const normalized = normalizeFieldValueRecursive(payload);

                await updateAdvance({
                    id: normalized.id,
                    amount: normalized.amount,
                    advance_date: normalized.advance_date,
                    month: normalized.month,
                    year: normalized.year,
                    status: normalized.status,
                    reason: normalized.reason,
                    
                    // Context fields for backend validation
                    scope_type: normalized.scope_type,
                    branch_id: normalized.branch_id,
                    department_id: normalized.department_id,
                    project_id: normalized.project_id,
                }).unwrap();

                toast.success("Advance updated successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                console.error("Update advance error:", apiErrors);
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error(apiErrors?.data?.message || "Failed to update advance");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this advance record?")) return;

                await deleteAdvance(id).unwrap();
                toast.success("Advance deleted successfully");
                refetch();
            } catch (error) {
                console.error("Delete advance error:", error);
                toast.error("Failed to delete advance");
            }
        },

        onDeleteGroup: async (data) => {
            try {
                if (!confirm("Are you sure you want to delete these advance records?")) return;
                
                const { openModel, mode, selectedId, ...payload } = data;
                const normalized = normalizeFieldValueRecursive(payload);
                let employeeIds = Array.from(selectedId || []);

                const finalPayload = {
                    ...normalized,
                    employee_ids: employeeIds,
                    employee_details: payload.employee_details
                };

                await deleteGroupAdvance(finalPayload).unwrap();
                toast.success("Advance records deleted successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (error) {
                console.error("Delete group advance error:", error);
                toast.error("Failed to delete advance records");
            }
        },

        onOpenModal: async () => {
            form.reset({ openModel: true, employee_details: [], scope_type: 'company', employee_type: 'company' });
        },
        
        onOpenDeleteGroupModal: async () => {
            form.reset({ openModel: true, model_for: 'delete_group_advance', employee_details: [], scope_type: 'company', employee_type: 'company' });
        }
    };

    return {
        actions,
        advanceState,
    };
};
