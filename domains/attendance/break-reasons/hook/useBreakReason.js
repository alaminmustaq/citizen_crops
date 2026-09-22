import { handleServerValidationErrors, formReset } from "@/utility/helpers";
import {
    useCreateBreakReasonMutation,
    useDeleteBreakReasonMutation,
    useFetchBreakReasonsQuery,
    useUpdateBreakReasonMutation,
} from "../services/breakReasonApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const useBreakReason = () => {
    const [createBreakReason] = useCreateBreakReasonMutation();
    const [updateBreakReason] = useUpdateBreakReasonMutation();
    const [deleteBreakReason] = useDeleteBreakReasonMutation();
    const { data, refetch, isFetching } = useFetchBreakReasonsQuery();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const breakReasonState = {
        data: data?.data?.break_reasons || [],
        form: {
            ...form,
            defaultValue: { status: "active" },
        },
        refetch,
        pagination: data?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onCreate: async (data) => {
            try {
                const { openModel, ...payload } = data;
                const response = await createBreakReason(payload).unwrap();

                if (response) {
                    toast.success("Break reason created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
                toast.error("Failed to create break reason");
            }
        },

        onEdit: (item) => {
            form.reset({
                id: item.id || "",
                name: item.name || "",
                status: item.status || "active",
                openModel: true,
            });
            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;
                const response = await updateBreakReason({ id, ...payload }).unwrap();

                if (response) {
                    toast.success("Break reason updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
                toast.error("Failed to update break reason");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this break reason?")) {
                    return;
                }

                const response = await deleteBreakReason(id).unwrap();

                if (response) {
                    toast.success("Break reason deleted successfully");
                    refetch();
                }
            } catch (error) {
                toast.error(
                    error?.data?.errors?.error ||
                        error?.data?.message ||
                        "Failed to delete break reason",
                );
            }
        },
    };

    return { actions, breakReasonState };
};
