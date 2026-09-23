import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    useCreateDamageMutation,
    useUpdateDamageMutation,
    useDeleteDamageMutation,
    useFetchDamagesQuery,
} from "../services/damageApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

export const useDamage = () => {
    const [createDamage] = useCreateDamageMutation();
    const [updateDamage] = useUpdateDamageMutation();
    const [deleteDamage] = useDeleteDamageMutation();
    const { data: damagesData, refetch, isFetching } = useFetchDamagesQuery();

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

    const fieldArray = useFieldArray({
        control: form.control,
        name: "damageTools", // This matches the field name in form
    });

    const damageState = {
        data: damagesData?.data?.damages || [],
        form: {
            ...form,
            fields: fieldArray, // Merge fieldArray into form
        },
        refetch,
        pagination: damagesData?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onCreate: async (data) => {
            try {
                const { openModel, ...payload } = data;
                // Normalize the rest of the payload
                const currentPayload = normalizeSelectValues(payload, [
                    "company_id",
                    "warehouse_id",
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
