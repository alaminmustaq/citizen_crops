import {
    handleServerValidationErrors,
    formReset,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useCreateEmailTemplateMutation,
    useUpdateEmailTemplateMutation,
    useDeleteEmailTemplateMutation,
    useFetchEmailTemplateListQuery,
} from "../services/emailTemplateApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";

export const useEmailTemplate = () => {
    const router = useRouter();
    const [createEmailTemplate] = useCreateEmailTemplateMutation();
    const [updateEmailTemplate] = useUpdateEmailTemplateMutation();
    const [deleteEmailTemplate] = useDeleteEmailTemplateMutation();

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
        data: emailTemplateListData,
        refetch,
        isFetching,
    } = useFetchEmailTemplateListQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const defaultValue = {
        status: "inactive",
    };

    const emailTemplateState = {
        data: emailTemplateListData?.data?.email_templates || [],
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: emailTemplateListData?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        // FILTER
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

        // RESET
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

        // CREATE
        onCreate: async (data) => {
            try {
                const { openModel, ...payload } = data;
                const response = await createEmailTemplate(payload).unwrap();

                if (response) {
                    toast.success("Template created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create template");
            }
        },

        // EDIT - populate modal form
        onEdit: (item) => {
            form.reset({
                id: item.id || "",
                template_name: item.template_name || "",
                type: item.type || "custom",
                subject: item.subject || "",
                message: item.message || "",
                status: item.status || "active",
                openModel: true,
            });
            form.setValue("openModel", true);
        },

        // UPDATE
        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;
                const response = await updateEmailTemplate({ id, ...payload }).unwrap();

                if (response) {
                    toast.success("Template updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update template");
            }
        },

        // DELETE
        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this template?"))
                    return;

                const response = await deleteEmailTemplate(id).unwrap();

                if (response) {
                    toast.success("Template deleted successfully");
                    refetch();
                }
            } catch (error) {
                console.error("Delete template error:", error);

                const apiMessage =
                    error?.data?.errors?.error ||
                    error?.data?.message ||
                    "Something went wrong while deleting the template.";

                toast.error(apiMessage);
            }
        },

        // DUPLICATE
        onDuplicate: (item) => {
            form.reset({
                template_name: `${item.template_name} (Copy)`,
                subject: item.subject || "",
                message: item.message || "",
                status: "inactive",
                openModel: true,
            });
            toast.success("Template duplicated. You can now edit and save it.");
        },
    };

    return {
        actions,
        emailTemplateState,
    };
};
