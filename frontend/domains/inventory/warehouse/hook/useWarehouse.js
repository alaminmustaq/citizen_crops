import { handleServerValidationErrors, formReset, debounce } from "@/utility/helpers";
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

export const useWarehouse = () => {
    const [warehouseCreate] = useWarehouseCreateMutation();
    const [warehouseUpdate] = useWarehouseUpdateMutation();
    const [warehouseDelete] = useWarehouseDeleteMutation();

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
    });

    //  Handle search query (debounced)
    const { data: warehouseSearchResult } = useWarehouseSearchQuery(
        { search: form.watch("search") },
        { skip: !form.watch("search") }
    );

    //  Fetch all warehouses
    const { data: warehouseData, refetch, isFetching } = useWarehouseFetchQuery();

    const warehouseState = {
        data: warehouseData?.data?.warehouses || [],
        pagination: warehouseData?.data?.pagination || {},
        form,
        refetch,
        isFetching,
    };

    const actions = {
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
