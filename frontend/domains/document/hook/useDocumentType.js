import {
    handleServerValidationErrors,
    formReset,
    debounce,
} from "@/utility/helpers";
import {
    useCreateDocumentTypeMutation,
    useUpdateDocumentTypeMutation,
    useDeleteDocumentTypeMutation,
    useFetchDocumentTypesQuery,
    useSearchDocumentTypesQuery,
} from "../services/documentTypeApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const useDocumentType = () => {
    const [createDocumentType] = useCreateDocumentTypeMutation();
    const [updateDocumentType] = useUpdateDocumentTypeMutation();
    const [deleteDocumentType] = useDeleteDocumentTypeMutation();

    const {
        data: documentTypeResponse,
        refetch,
        isFetching,
    } = useFetchDocumentTypesQuery();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const documentTypesState = {
        data: documentTypeResponse?.data?.document_types || [],
        form,
        refetch,
        pagination: documentTypeResponse?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onCreate: async (data) => {
            try {
                const { openModel, ...payload } = data;

                const response = await createDocumentType(payload).unwrap();

                if (response.success) {
                    toast.success("Document Type created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onEdit: (data) => {
            form.reset({
                id: data.id || "",
                name: data.name || "",
                icon: data.icon || "",
                status: data.status ? "active" : "inactive",
            });

            form.setValue("openModel", true);
        },
        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;

                const response = await updateDocumentType({
                    id,
                    credentials: payload,
                }).unwrap();

                if (response.success) {
                    toast.success("Document Type updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onDelete: async (id) => {
            try {
                if (
                    confirm(
                        "Are you sure you want to delete this document type?"
                    )
                ) {
                    const response = await deleteDocumentType({ id });

                    if (response?.data?.success) {
                        toast.success("Document Type deleted successfully");
                        refetch();
                    } else if (response?.error?.data?.errors?.message) {
                        toast.error(response?.error?.data?.errors?.message);
                    } else {
                        toast.error(
                            "Failed to delete document type. Please try again."
                        );
                    }
                }
            } catch (error) {
                console.error("Delete document type error:", error);

                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "Something went wrong while deleting document type."
                    );
                }
            }
        },

    };

    return {
        actions,
        documentTypesState,
    };
};
