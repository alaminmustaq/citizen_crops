import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useCreateDamageMutation,
    useUpdateDamageMutation,
    useDeleteDamageMutation,
    useFetchDamagesQuery,
} from "../services/damageApi";
import toast from "react-hot-toast";
import {
    purchaseSearchTemplate,
    toolSearchTemplate,
    warehouseSearchTemplate,
    branchSearchTemplate,
} from "@/utility/templateHelper";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import useAuth from "@/domains/auth/hooks/useAuth";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useDamage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [createDamage] = useCreateDamageMutation();
    const [updateDamage] = useUpdateDamageMutation();
    const [deleteDamage] = useDeleteDamageMutation();
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
        data: damagesData,
        refetch,
        isFetching,
    } = useFetchDamagesQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            id: "",
            date: "",
            warehouse_id: "",
            note: "",
            damageTools: [],
            openModel: false,
        },
    });

    const defaultValue = {
        branch_id:
            branchSearchTemplate(
                user?.employee?.branch ? [user?.employee?.branch] : [],
            )?.at(0) ?? null,
    };

    const fieldArray = useFieldArray({
        control: form.control,
        name: "damageTools", // This matches the field name in form
    });

    const damageState = {
        data: damagesData?.data?.damages || [],
        form: {
            ...form,
            fields: fieldArray,
            defaultValue: defaultValue, // Merge fieldArray into form
        },
        refetch,
        pagination: damagesData?.data?.pagination || {},
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
        onCreate: async (data) => {
            try {
                const { openModel, ...payload } = data;
                // Normalize the rest of the payload
                const currentPayload = normalizeSelectValues(payload, [
                    "company_id",
                    "warehouse_id",
                    "branch_id",
                ]);

                const response = await createDamage(currentPayload).unwrap();
                if (response) {
                    toast.success("Tool damage recorded successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to record tool damage");
            }
        },

        onUpdate: async (data) => {
            try {
                const { openModel, ...payload } = data;
                const { id } = payload;

                // Normalize dropdown values for API
                const currentPayload = normalizeSelectValues(payload, [
                    "company_id",
                    "warehouse_id",
                    "branch_id",
                ]);

                const response = await updateDamage({
                    id,
                    ...currentPayload,
                }).unwrap();

                if (response) {
                    toast.success("Tool damage updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update tool damage");
            }
        },

        onDelete: async (id) => {
            try {
                const response = await deleteDamage(id).unwrap();
                if (response) {
                    toast.success("Tool damage deleted successfully");
                    refetch();
                }
            } catch (error) {
                toast.error("Failed to delete tool damage");
            }
        },

        onEdit: (item) => {
            // Prepare damageTools for the form using damage_details from API response
            const damageTools = (item.damage_details || []).map((tool) => ({
                tool_id: tool.tool_id,
                tool_name: tool.tool_name,
                quantity: tool.quantity,
                unit_price: tool.unit_price,
                available_stock: tool.stock || 0,
                note: tool.note || "",
            }));

            form.reset({
                id: item.id,
                date: item.date || "",
                warehouse_id: item.warehouse
                    ? { label: item.warehouse.name, value: item.warehouse.id }
                    : item.warehouse_id
                      ? { label: "Unknown", value: item.warehouse_id }
                      : null,
                branch_id: item.branch
                    ? { label: item.branch.name, value: item.branch.id }
                    : item.branch_id
                      ? { label: "Unknown", value: item.branch_id }
                      : null,

                note: item.note || "",
                damageTools: damageTools,
                openModel: true,
            });
        },

        onSubmit: async (data) => {
            if (data?.id) {
                await actions.onUpdate(data);
            } else {
                await actions.onCreate(data);
            }
        },
    };

    return {
        actions,
        damageState,
    };
};
