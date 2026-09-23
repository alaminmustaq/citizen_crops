import { handleServerValidationErrors, formReset, debounce } from "@/utility/helpers";
import {
    useClientCreateMutation,
    useClientUpdateMutation,
    useClientDeleteMutation,
    useClientSearchQuery,
    useClientFetchQuery,
} from "../services/clientApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const useClient = () => {
    const [clientCreate] = useClientCreateMutation();
    const [clientUpdate] = useClientUpdateMutation();
    const [clientDelete] = useClientDeleteMutation();

    const { data: client, refetch, isFetching } = useClientFetchQuery();
    console.log(client);
    
    const form = useForm({ mode: "onBlur", reValidateMode: "onSubmit", shouldFocusError: true });

    const { data: clientSearchResult } = useClientSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") }
    );

    const clientState = {
        data: client?.data?.clients || [],
        form,
        refetch,
        isFetching,
    };

    const actions = {
        onCreate: async (data) => {
            try {
                const response = await clientCreate(data).unwrap();
                toast.success("Client created successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        onEdit: (data) => {
            form.reset({
                id: data.id || "",
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                client_type: data.client_type || "individual",
                tax_id: data.tax_id || "",
                status: data.status || "prospect",
                address: data.address || "",
                observations: data.observations || "",
            });
            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { id, ...other } = data;
                await clientUpdate({ id, credentials: other }).unwrap();
                toast.success("Client updated successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        onDelete: async (id) => {
            if (confirm("Are you sure you want to delete this client?")) {
                try {
                    await clientDelete({ id }).unwrap();
                    toast.success("Client deleted successfully");
                    refetch();
                } catch {
                    toast.error("Something went wrong while deleting client.");
                }
            }
        },

        onSearch: debounce((inputValue, callback) => {
            form.setValue("search", inputValue);
            const res = clientSearchResult?.data?.clients || [];
            callback(res);
        }, 500),
    };

    return { actions, clientState };
};
