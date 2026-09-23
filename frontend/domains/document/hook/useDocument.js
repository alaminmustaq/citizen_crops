import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
    useDeleteDocumentDetailMutation,
    useFetchDocumentsQuery,
} from "../services/documentApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { documentTypeTemplate, branchSearchTemplate, employTemplate, clientTemplate,projectTemplate } from "@/utility/templateHelper";

export const useDocument = () => {
    const [createDocument] = useCreateDocumentMutation();
    const [updateDocument] = useUpdateDocumentMutation();
    const [deleteDocument] = useDeleteDocumentMutation();
    const [deleteDocumentDetail] = useDeleteDocumentDetailMutation();

    const {
        data: documentResponse,
        refetch,
        isFetching,
    } = useFetchDocumentsQuery();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            id: "",
            title: "",
            description: "",
            document_type_id: "",
            employee_id: "",
            branch_id: "",
            status: "active",
            document: [],
            openModel: false,
        },
    });
    const fieldArray = useFieldArray({
        control: form.control,
        name: "document", // This matches the field name in form
    });

    const documentsState = {
        data: documentResponse?.data?.documents || [],
        form: {
            ...form,
            fields: fieldArray, // Merge fieldArray into form
        },
        refetch,
        pagination: documentResponse?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onCreate: async (data) => {
            try {
                const { openModel, document, ...payload } = data;

                // Normalize each document in the list
                const currentDocList = (document || []).map((item) =>
                    normalizeSelectValues(item, ["type"])
                );


                // Normalize the rest of the payload
                const currentPayload = normalizeSelectValues(payload, [
                    "branch_id",
                    "employee_id",
                    "client_id",
                    "project_id",
                ]);

                // Create FormData for file uploads
                const formData = new FormData();

                // Add master document fields
                Object.keys(currentPayload).forEach((key) => {
                    if (
                        currentPayload[key] !== null &&
                        currentPayload[key] !== undefined
                    ) {
                        formData.append(key, currentPayload[key]);
                    }
                });

                // Add document details with files
                currentDocList.forEach((item, index) => {
                    Object.keys(item).forEach((key) => {
                        if (key === "file" && item[key] instanceof File) {
                            // Append file
                            formData.append(
                                `document[${index}][file]`,
                                item[key]
                            );
                            console.log(
                                `Added file: document[${index}][file]`,
                                item[key].name
                            );
                        } else if (
                            item[key] !== null &&
                            item[key] !== undefined
                        ) {
                            // Append other fields
                            formData.append(
                                `document[${index}][${key}]`,
                                item[key]
                            );
                            
                        }
                    });
                });

       
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                const response = await createDocument(formData).unwrap();

                if (response.success) {
                    toast.success("Document created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onEdit: (data) => {
            console.log("Editing document:", data);
        
            // Prepare document details for the form
            const documentDetails = (data.document_details || []).map((detail) => ({
                id: detail.id,
                title: detail.title,
                type: documentTypeTemplate(detail.type ? [detail.type] : [])?.at(0) ?? null,
                expiry_date: detail.expiry_date,
                expiry_warning: detail.expiry_warning,
                file_path: detail.file_path,
                file_name: detail.file_name,
                status: detail.status,
                // Use full URL for file preview
                file: detail.file_url || null,
            }));
        
            // Prepare the full form reset data
            const resetData = {
                id: data.id || "",
                title: data.title || "",
                description: data.description || "",
                document_for: data.document_for || "",
                document_type_id: data.document_type?.id || "",
                employee_id: employTemplate(data.employee ? [data.employee] : [])?.at(0) ?? null,
                branch_id: branchSearchTemplate(data.branch ? [data.branch] : [])?.at(0) ?? null,
                client_id: clientTemplate(data.client ? [data.client] : [])?.at(0) ?? null,
                project_id: projectTemplate(data.project ? [data.project] : [])?.at(0) ?? null,
                status: data.status ? "active" : "inactive",
                document: documentDetails,
            };
        
            // Reset the form with existing data
            form.reset(resetData);
        
            // Open the modal for editing
            form.setValue("openModel", true);
        },
        
        onUpdate: async (data) => {
           
            try {
                const { openModel, id, document, ...payload } = data;

              

                // Create FormData for update (similar to create)
                const formData = new FormData();

                // Normalize the master payload
                const currentPayload = normalizeSelectValues(payload, [
                    "branch_id",
                    "employee_id",
                    "client_id",
                    "project_id",
                ]);

                // Add master document fields
                Object.keys(currentPayload).forEach((key) => {
                    if (
                        currentPayload[key] !== null &&
                        currentPayload[key] !== undefined
                    ) {
                        formData.append(key, currentPayload[key]);
                    }
                });

                // Add document details with files
                const currentDocList = (document || []).map((item) =>
                    normalizeSelectValues(item, ["type"])
                );

                currentDocList.forEach((item, index) => {
                    Object.keys(item).forEach((key) => {
                        if (key === "file" && item[key] instanceof File) {
                            // Append new file
                            formData.append(
                                `document[${index}][file]`,
                                item[key]
                            );
                        } else if (
                            item[key] !== null &&
                            item[key] !== undefined
                        ) {
                            // Append other fields
                            formData.append(
                                `document[${index}][${key}]`,
                                item[key]
                            );
                        }
                    });
                });

                const response = await updateDocument({
                    id,
                    credentials: formData,
                }).unwrap();

                if (response.success) {
                    toast.success("Document updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onDelete: async (id) => {
            console.log("onDelete called with ID:", id);
            try {
                if (confirm("Are you sure you want to delete this document?")) {
                    console.log("User confirmed deletion, calling API...");
                    const response = await deleteDocument({ id });

                    console.log("Delete response:", response);

                    if (response?.data?.success) {
                        toast.success("Document deleted successfully");
                        refetch();
                    } else if (response?.error?.data?.errors?.message) {
                        toast.error(response?.error?.data?.errors?.message);
                    } else {
                        toast.error(
                            "Failed to delete document. Please try again."
                        );
                    }
                }
            } catch (error) {
                console.error("Delete document error:", error);

                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "Something went wrong while deleting document."
                    );
                }
            }
        },
        onDeleteDetail: async (documentId, detailId) => {
            try {
                if (
                    confirm(
                        "Are you sure you want to delete this document detail?"
                    )
                ) {
                    const response = await deleteDocumentDetail({
                        documentId,
                        detailId,
                    });

                    if (response?.data?.success) {
                        toast.success("Document detail deleted successfully");
                        refetch();
                    } else if (response?.error?.data?.errors?.message) {
                        toast.error(response?.error?.data?.errors?.message);
                    } else {
                        toast.error(
                            "Failed to delete document detail. Please try again."
                        );
                    }
                }
            } catch (error) {
                console.error("Delete document detail error:", error);
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "Something went wrong while deleting document detail."
                    );
                }
            }
        },
    };

    return {
        actions,
        documentsState,
    };
};
