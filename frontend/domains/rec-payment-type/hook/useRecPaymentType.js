import { handleServerValidationErrors, formReset, debounce } from "@/utility/helpers";
import {
    useRecPaymentTypeCreateMutation,
    useRecPaymentTypeUpdateMutation,
    useRecPaymentTypeDeleteMutation,
    useRecPaymentTypeFetchQuery,
    useRecPaymentTypeSearchQuery,
} from "../services/recPaymentTypeApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useMemo } from "react";

export const useRecPaymentType = () => {
    const [createItem] = useRecPaymentTypeCreateMutation();
    const [updateItem] = useRecPaymentTypeUpdateMutation();
    const [deleteItem] = useRecPaymentTypeDeleteMutation();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    // Search (debounced auto-fetch)
    const { data: searchResult } = useRecPaymentTypeSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") }
    );

    // Fetch list
    const { data: listData, refetch, isFetching } = useRecPaymentTypeFetchQuery();

    const state = {
        data: listData?.data?.items || [],
        pagination: listData?.data?.pagination || {},
        form,
        refetch,
        isFetching,
    };

    const actions = {
        // CREATE
        onCreate: async (data) => {
            try {
                const { openModel, ...payload } = data;
                const response = await createItem(payload).unwrap();

                toast.success("Payment type created successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        // FILL FORM FOR EDIT
        onEdit: (data) => {
            form.reset({
                id: data.id,
                name: data.name,
                transaction_for: data.transaction_for,
                status: data.status || "active",
            });
            form.setValue("openModel", true);
        },

        // UPDATE
        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;
                await updateItem({ id, credentials: payload }).unwrap();

                toast.success("Payment type updated successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        // DELETE
        onDelete: (id) => {
            if (confirm("Are you sure you want to delete this payment type?")) {
                deleteItem({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Payment type deleted successfully");
                        refetch();
                    })
                    .catch(() => {
                        toast.error("Failed to delete payment type");
                    });
            }
        },

        // SEARCH (for autocomplete etc.)
        onSearch: debounce(async (input, callback) => {
            form.setValue("search", input);
            const results = searchResult?.data?.items || [];
            callback(results); // map to custom template if needed
        }, 500),
    };

    return { actions, recPaymentTypeState: state };
};
