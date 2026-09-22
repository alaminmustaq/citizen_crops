import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useCreateToolMutation,
    useUpdateToolMutation,
    useDeleteToolMutation,
    useFetchToolsQuery,
} from "../services/toolApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
    categorySearchTemplate,
    unitSearchTemplate,
} from "@/utility/templateHelper";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";
export const useTool = () => {
    const router = useRouter();
    const [createTool] = useCreateToolMutation();
    const [updateTool] = useUpdateToolMutation();
    const [deleteTool] = useDeleteToolMutation();
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
        data: toolsData,
        refetch,
        isFetching,
    } = useFetchToolsQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const defaultValue = {
        status: "active",
    };

    const toolState = {
        data: toolsData?.data?.tools || [],
        pagination: toolsData?.data?.pagination || {},
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
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
                const { openModel, ...other } = data;

                // Normalize dropdown values for API
                const payload = normalizeSelectValues(other, [
                    "category_id",
                    "unit_id",
                ]);

                const response = await createTool(payload).unwrap();
                if (response) {
                    toast.success("Tool created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create tool");
            }
        },

        onEdit: (item) => {
            console.log(item);

            form.reset({
                id: item.id || "",
                name: item.name || "",
                sku: item.sku || "",
                opening_date: item.opening_date || "",

                // Normalize dropdowns
                category_id:
                    categorySearchTemplate(
                        item.category ? [item.category] : [],
                    )?.at(0) ?? null,
                unit_id:
                    unitSearchTemplate(item.unit ? [item.unit] : [])?.at(0) ??
                    null,

                current_quantity: item.current_quantity || 0,
                minimum_quantity: item.minimum_quantity || 0,
                unit_price: item.unit_price || 0,
                location: item.location || "",
                status: item.status || "active",
                description: item.description || "",
                notes: item.notes || "",
            });

            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, ...other } = data;

                // Normalize dropdown values for API
                const payload = normalizeSelectValues(other, [
                    "category_id",
                    "unit_id",
                ]);

                const response = await updateTool({ id, ...payload }).unwrap();
                if (response) {
                    toast.success("Tool updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update tool");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this tool?"))
                    return;
                const response = await deleteTool(id).unwrap();
                if (response) {
                    toast.success("Tool deleted successfully");
                    refetch();
                } else {
                    toast.error("Failed to delete tool");
                }
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },
    };

    return {
        actions,
        toolState,
    };
};
