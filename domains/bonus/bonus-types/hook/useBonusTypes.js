import {
    handleServerValidationErrors,
    formReset,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useCreateBonusTypeMutation,
    useUpdateBonusTypeMutation,
    useDeleteBonusTypeMutation,
    useFetchBonusTypesQuery,
} from "../services/bonusTypesApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useBonusTypes = () => {
    const router = useRouter();
    const [createBonusType] = useCreateBonusTypeMutation();
    const [updateBonusType] = useUpdateBonusTypeMutation();
    const [deleteBonusType] = useDeleteBonusTypeMutation();
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };
    const {
        data: bonusData,
        refetch,
        isFetching,
    } = useFetchBonusTypesQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const defaultValue = {
        status: "active",
    };

    const bonusState = {
        data: bonusData?.data?.bonus_types || [],
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: bonusData?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        onFilter: async () => {
            const values = form.getValues();
            const payload = prepareFilterPayload(values, searchParams);
            setFilters(payload);
            router.push(`${pathname}`);
            refetch();
        },

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
                await createBonusType(payload).unwrap();
                toast.success("Bonus type created successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create bonus type");
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
                await updateBonusType({ id, ...payload }).unwrap();
                toast.success("Bonus type updated successfully");
                refetch();
                formReset(form);
                form.setValue("openModel", false);
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update bonus type");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this bonus type?"))
                    return;
                await deleteBonusType(id).unwrap();
                toast.success("Bonus type deleted successfully");
                refetch();
            } catch (error) {
                const apiMessage =
                    error?.data?.errors?.error ||
                    error?.data?.message ||
                    "Something went wrong while deleting bonus type.";
                toast.error(apiMessage);
            }
        },
    };

    return {
        actions,
        bonusState,
    };
};
