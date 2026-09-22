import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useCreatePunishmentMutation,
    useUpdatePunishmentMutation,
    useDeletePunishmentMutation,
    useFetchPunishmentQuery,
} from "../services/punishmentTypesApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const usePunishmentTypes = () => {
    const router = useRouter();
    const [createPunishment] = useCreatePunishmentMutation();
    const [updatePunishment] = useUpdatePunishmentMutation();
    const [deletePunishment] = useDeletePunishmentMutation();
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
        data: punishmentData,
        refetch,
        isFetching,
    } = useFetchPunishmentQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const defaultValue = {
        status: "active",
    };

    const punishmentState = {
        data: punishmentData?.data?.punishment_types || [],
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: punishmentData?.data?.pagination || {},
        isFetching,
    };
    // console.log(punishmentData);

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
                const { openModel, ...payload } = data;
                const response = await createPunishment(payload).unwrap();

                if (response) {
                    toast.success("Punishment created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create punishment");
            }
        },

        onEdit: (item) => {
            form.reset({
                id: item.id || "",
                name: item.name || "",
                days_per_year: item.days_per_year || 0, // include allowed days
                status: item.status || "active", // keep status
                is_paid: item.is_paid || "", // keep status
                description: item.description || "", // include description
                openModel: true, // open modal
            });
            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;
                const response = await updatePunishment({
                    id,
                    ...payload,
                }).unwrap();

                if (response) {
                    toast.success("Punishment updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update punishment");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this punishment?"))
                    return;

                const response = await deletePunishment(id).unwrap();

                if (response) {
                    toast.success("Punishment deleted successfully");
                    refetch();
                }
            } catch (error) {
                console.error("Delete punishment error:", error);

                // ✅ Read API error message
                const apiMessage =
                    error?.data?.errors?.error ||
                    error?.data?.message ||
                    "Something went wrong while deleting punishment.";

                toast.error(apiMessage);
            }
        },
    };

    return {
        actions,
        punishmentState,
    };
};
