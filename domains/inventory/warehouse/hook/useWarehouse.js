import { handleServerValidationErrors, formReset, debounce,  normalizeSelectValues,
    prepareFilterPayload, } from "@/utility/helpers";
import {
    useWarehouseCreateMutation,
    useWarehouseUpdateMutation,
    useWarehouseDeleteMutation,
    useWarehouseFetchQuery,
    useWarehouseSearchQuery,
} from "../services/warehouseApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { purchaseSearchTemplate, toolSearchTemplate,warehouseSearchTemplate } from "@/utility/templateHelper";
import { useMemo } from "react";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useWarehouse = () => {
    const router = useRouter();
    const [warehouseCreate] = useWarehouseCreateMutation();
    const [warehouseUpdate] = useWarehouseUpdateMutation();
    const [warehouseDelete] = useWarehouseDeleteMutation();
      // For Filters
    const [filters, setFilters] = useState({});
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageFromUrl = searchParams.get("page") || "1";
    const queryParams = {
        ...filters,
        ...(pageFromUrl ? { page: pageFromUrl } : {}),
    };

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });
       const defaultValue={
        status: 'active',
    }


    //  Handle search query (debounced)
    const { data: warehouseSearchResult } = useWarehouseSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") }
    );

    //  Fetch all warehouses
    const { data: warehouseData, refetch, isFetching } = useWarehouseFetchQuery({ params: queryParams });

    const warehouseState = {
        data: warehouseData?.data?.warehouses || [],
        pagination: warehouseData?.data?.pagination || {},
        form: {
            ...form,
            defaultValue: defaultValue
          },
        refetch,
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
        //  Create multiple warehouses
        onCreate: async (data) => {
            try {
                const { openModel, ...payload } = data;

                const response = await warehouseCreate(payload).unwrap();

                if (response) {
                    toast.success("Warehouse created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        //  Fill form for editing
        onEdit: (data) => {
            form.reset({
                id: data.id || "",
                name: data.name || "",
                location: data.location || "",
                status: data.status || "active",
                // company_id: data.company_id || "",
            });

            form.setValue("openModel", true);
        },

        //  Update warehouse
        onUpdate: async (data) => {
            try {
                const { openModel, id, ...payload } = data;
                const response = await warehouseUpdate({ id, credentials: payload }).unwrap();

                if (response) {
                    toast.success("Warehouse updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        //  Delete warehouse
        onDelete: (id) => {
            if (confirm("Are you sure you want to delete this warehouse?")) {
                warehouseDelete({ id })
                    .unwrap()
                    .then(() => {
                        toast.success("Warehouse deleted successfully");
                        refetch();
                    })
                    .catch(() => {
                        toast.error("Failed to delete warehouse");
                    });
            }
        },

        //  Search warehouse (debounced)
        onSearch: debounce(async (inputValue, callback) => {
            form.setValue("search", inputValue);
            const results = warehouseSearchResult?.data?.warehouses || [];
            callback(warehouseSearchTemplate(results));
        }, 500),
    };

    return {
        actions,
        warehouseState,
    };
};
