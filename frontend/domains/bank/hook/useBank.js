import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    useCreateBankMutation,
    useUpdateBankMutation,
    useDeleteBankMutation,
    useFetchBanksQuery,
} from "../services/bankApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";

export const useBank = () => {
    // ===== RTK Query hooks =====
    const [createBank] = useCreateBankMutation();
    const [updateBank] = useUpdateBankMutation();
    const [deleteBank] = useDeleteBankMutation();
    const { data: bankData, refetch, isFetching } = useFetchBanksQuery();

    // ===== React Hook Form setup =====
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: { branches: [] },
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "branches",
    });

    const bankState = {
        data: bankData?.data?.banks || [],
        form: { ...form, fields: fieldArray },
        refetch,
        isFetching,
    };

    // ===== Actions =====
    const actions = {
        onCreate: async (data) => {
            try {
                let { openModel, ...payload } = data;
                payload = normalizeSelectValues(payload, ["bank_name"]);

                payload.branches = (payload.branches || []).map((b) => ({
                    branch_name: b.branch_name || "",
                    branch_address: b.branch_address || "",
                    account_no: b.account_no || "",
                    account_holder_name: b.account_holder_name || "",
                    status: Number(b.status ?? 1),
                }));

                const response = await createBank(payload).unwrap();
                if (response) {
                    toast.success("Bank created successfully");
                    await refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create bank");
            }
        },

        onUpdate: async (data) => {
            try {
                let { openModel, id, ...payload } = data;
                payload = normalizeSelectValues(payload, ["bank_name"]);

                payload.branches = (payload.branches || []).map((b) => ({
                    id: b.id ?? null,
                    branch_name: b.branch_name || "",
                    branch_address: b.branch_address || "",
                    account_no: b.account_no || "",
                    account_holder_name: b.account_holder_name || "",
                    status: Number(b.status ?? 1),
                }));

                const response = await updateBank({ id, ...payload }).unwrap();
                if (response) {
                    toast.success("Bank updated successfully");
                    await refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update bank");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this bank?"))
                    return;
                const response = await deleteBank(id).unwrap();
                if (response) {
                    toast.success("Bank deleted successfully");
                    refetch();
                }
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },

        onEdit: (item) => {
            // Map branches and preserve IDs
            const branches = (item.branches || []).map((b) => ({
                branch_name: b.branch_name || "",
                branch_address: b.branch_address || "",
                account_no: b.account_no || "",
                account_holder_name: b.account_holder_name || "",
                status: Number(b.status ?? 1),
            }));

            // Reset the form completely
            form.reset({
                id: item.id,
                bank_name: item.bank_name,
                branches,
                openModel: true,
            });

            // Register the branch IDs manually
            (item.branches || []).forEach((b, index) => {
                form.setValue(`branches.${index}.id`, b.id);
            });
        },

        onSubmit: async (data) => {
            if (data?.id) await actions.onUpdate(data);
            else await actions.onCreate(data);
        },
    };

    return { actions, bankState };
};
