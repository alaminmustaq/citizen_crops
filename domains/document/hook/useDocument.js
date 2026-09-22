import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    documentTypeTemplate,
    branchSearchTemplate,
    employTemplate,
    clientTemplate,
    projectTemplate,
} from "@/utility/templateHelper";
import {
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
    useDeleteDocumentDetailMutation,
    useFetchDocumentsQuery,
    useLazyGetDocumentByIdQuery,
} from "../services/documentApi";
import { setDocumentData } from "../model/documentSlice";
// import { useParams } from "next/navigation";
import useAuth from "@/domains/auth/hooks/useAuth";
import { useState, useEffect } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useDocument = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Mutations
    const [createDocument] = useCreateDocumentMutation();
    const [updateDocument] = useUpdateDocumentMutation();
    const [deleteDocument] = useDeleteDocumentMutation();
    const [deleteDocumentDetail] = useDeleteDocumentDetailMutation();
    const { id } = useParams();
    // For Filters
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };
    // Queries
    // const { data: documentResponse, refetch, isFetching } = useFetchDocumentsQuery();
    const [triggerGetDocumentById] = useLazyGetDocumentByIdQuery();
    const {
        data: documentResponse,
        refetch,
        isFetching,
        isSuccess,
    } = useFetchDocumentsQuery(
        id
            ? {
                  id,
                  params: queryParams,
              }
            : { params: queryParams },
        {
            refetchOnMountOrArgChange: true,
        },
    );

    useEffect(() => {
        if (isSuccess && documentResponse?.data) {
            dispatch(setDocumentData(documentResponse.data.data));
        }
    }, [isSuccess, documentResponse?.data, dispatch]);

    const { user } = useAuth();

    // Form
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
            document: [
                {
                    title: null,
                    type: null,
                    expiry_date: "",
                    expiry_warning: 0,
                    file: "",
                },
            ],
            openModel: false,
        },
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "document",
    });

    // Ensure at least one transaction detail exists
    if (fieldArray.fields.length === 0) {
        fieldArray.append({
            title: null,
            type: null,
            expiry_date: "",
            expiry_warning: 0,
            file: "",
        });
    }

    const defaultValue = {
        branch_id:
            branchSearchTemplate(
                user?.employee?.branch ? [user?.employee?.branch] : [],
            )?.at(0) ?? null,
    };

    const documentsState = {
        data: documentResponse?.data?.documents || [],
        form: { ...form, fields: fieldArray, defaultValue: defaultValue },
        refetch,
        pagination: documentResponse?.data?.pagination || {},
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
                const { openModel, document, ...payload } = data;
                const formData = new FormData();

                // Normalize payload
                const currentPayload = normalizeSelectValues(payload, [
                    "branch_id",
                    "employee_id",
                    "client_id",
                    "project_id",
                ]);
                Object.keys(currentPayload).forEach((key) => {
                    if (currentPayload[key] != null)
                        formData.append(key, currentPayload[key]);
                });

                // Normalize document details
                (document || []).forEach((item, index) => {
                    const normalizedItem = normalizeSelectValues(item, [
                        "type",
                    ]);
                    Object.keys(normalizedItem).forEach((key) => {
                        if (
                            key === "file" &&
                            normalizedItem[key] instanceof File
                        ) {
                            formData.append(
                                `document[${index}][file]`,
                                normalizedItem[key],
                            );
                        } else if (normalizedItem[key] != null) {
                            formData.append(
                                `document[${index}][${key}]`,
                                normalizedItem[key],
                            );
                        }
                    });
                });

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
            const documentDetails = (data.document_details || []).map(
                (detail) => ({
                    id: detail.id,
                    title: detail.title,
                    type:
                        documentTypeTemplate(
                            detail.type ? [detail.type] : [],
                        )?.at(0) ?? null,
                    expiry_date: detail.expiry_date,
                    expiry_warning: detail.expiry_warning,
                    file_path: detail.file_path,
                    file_name: detail.file_name,
                    status: detail.status,
                    file: detail.file_url || null,
                }),
            );

            const resetData = {
                id: data.id || "",
                title: data.title || "",
                description: data.description || "",
                document_for: data.document_for || "",
                document_type_id: data.document_type?.id || "",
                employee_id:
                    employTemplate(data.employee ? [data.employee] : [])?.at(
                        0,
                    ) ?? null,
                branch_id:
                    branchSearchTemplate(data.branch ? [data.branch] : [])?.at(
                        0,
                    ) ?? null,
                client_id:
                    clientTemplate(data.client ? [data.client] : [])?.at(0) ??
                    null,
                project_id:
                    projectTemplate(data.project ? [data.project] : [])?.at(
                        0,
                    ) ?? null,
                status: data.status ? "active" : "inactive",
                document: documentDetails,
            };

            form.reset(resetData);
            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, document, ...payload } = data;
                const formData = new FormData();
                const currentPayload = normalizeSelectValues(payload, [
                    "branch_id",
                    "employee_id",
                    "client_id",
                    "project_id",
                ]);
                Object.keys(currentPayload).forEach((key) => {
                    if (currentPayload[key] != null)
                        formData.append(key, currentPayload[key]);
                });

                (document || []).forEach((item, index) => {
                    const normalizedItem = normalizeSelectValues(item, [
                        "type",
                    ]);
                    Object.keys(normalizedItem).forEach((key) => {
                        if (
                            key === "file" &&
                            normalizedItem[key] instanceof File
                        ) {
                            formData.append(
                                `document[${index}][file]`,
                                normalizedItem[key],
                            );
                        } else if (normalizedItem[key] != null) {
                            formData.append(
                                `document[${index}][${key}]`,
                                normalizedItem[key],
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
            if (!confirm("Are you sure you want to delete this document?"))
                return;
            try {
                const response = await deleteDocument({ id });
                if (response?.data?.success) {
                    toast.success("Document deleted successfully");
                    refetch();
                } else {
                    toast.error("Failed to delete document.");
                }
            } catch (error) {
                toast.error("Something went wrong while deleting document.");
            }
        },

        onDeleteDetail: async (documentId, detailId) => {
            if (
                !confirm(
                    "Are you sure you want to delete this document detail?",
                )
            )
                return;
            try {
                const response = await deleteDocumentDetail({
                    documentId,
                    detailId,
                });
                if (response?.data?.success) {
                    toast.success("Document detail deleted successfully");
                    refetch();
                } else {
                    toast.error("Failed to delete document detail.");
                }
            } catch (error) {
                toast.error(
                    "Something went wrong while deleting document detail.",
                );
            }
        },
    };

    return { actions, documentsState, form };
};
