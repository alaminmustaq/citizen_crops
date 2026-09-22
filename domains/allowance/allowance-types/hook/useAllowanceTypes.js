import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useCreateAllowanceMutation,
    useUpdateAllowanceMutation,
    useDeleteAllowanceMutation,
    useFetchAllowanceQuery,
} from "../services/allowanceTypesApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useAllowanceTypes = () => {
    const router = useRouter();
    const [createAllowance] = useCreateAllowanceMutation();
    const [updateAllowance] = useUpdateAllowanceMutation();
    const [deleteAllowance] = useDeleteAllowanceMutation();
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
        data: allowanceData,
        refetch,
        isFetching,
    } = useFetchAllowanceQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    const defaultValue = {
        status: "active",
    };

    const allowanceState = {
        data: allowanceData?.data?.allowance_types || [],
        form: {
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: allowanceData?.data?.pagination || {},
        isFetching,
    };
    // console.log(allowanceData);

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
                const response = await createAllowance(payload).unwrap();

                if (response) {
                    toast.success("Allowance created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create allowance");
            }
        },

        onEdit: (item) => {
            form.reset({
                id: item.id || "",
                name: item.name || "", 
                type: item.type || "", // keep status
                status: item.status || "active", // keep status 
                openModel: true, // open modal
            });
            form.setValue("openModel", true);
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;
                const response = await updateAllowance({
                    id,
                    ...payload,
                }).unwrap();

                if (response) {
                    toast.success("Allowance updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update allowance");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this allowance?"))
                    return;

                const response = await deleteAllowance(id).unwrap();

                if (response) {
                    toast.success("Allowance deleted successfully");
                    refetch();
                }
            } catch (error) {
                console.error("Delete allowance error:", error);

                // ✅ Read API error message
                const apiMessage =
                    error?.data?.errors?.error ||
                    error?.data?.message ||
                    "Something went wrong while deleting allowance.";

                toast.error(apiMessage);
            }
        },
    };

    return {
        actions,
        allowanceState,
    };
};
