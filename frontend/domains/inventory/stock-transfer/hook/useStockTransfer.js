import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    useCreateStockTransferMutation,
    useUpdateStockTransferMutation,
    useDeleteStockTransferMutation,
    useFetchStockTransfersQuery,
} from "../services/stockTransferApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";

export const useStockTransfer = () => {
    // ===== RTK Query hooks =====
    const [createStockTransfer] = useCreateStockTransferMutation();
    const [updateStockTransfer] = useUpdateStockTransferMutation();
    const [deleteStockTransfer] = useDeleteStockTransferMutation();
    const { data: stockTransferData, refetch, isFetching } =
        useFetchStockTransfersQuery();

    // ===== React Hook Form setup =====
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: { details: [] },
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "details",
    });

    const stockTransferState = {
        data: stockTransferData?.data?.transfers || [],
        form: { ...form, fields: fieldArray },
        refetch,
        isFetching,
    };

    // ===== Actions =====
    const actions = {
        onCreate: async (data) => {
            try {
                const { openModel, tool_id, ...other } = data;

                let payload = normalizeSelectValues(other, [
                    "sender_warehouse_id",
                    "destination_warehouse_id",
                ]);

                if (
                    payload.sender_warehouse_id &&
                    typeof payload.sender_warehouse_id === "object"
                ) {
                    payload.sender_warehouse_id = payload.sender_warehouse_id.value;
                }

                if (
                    payload.destination_warehouse_id &&
                    typeof payload.destination_warehouse_id === "object"
                ) {
                    payload.destination_warehouse_id = payload.destination_warehouse_id.value;
                }

                const details = (payload.details || []).map((d) => ({
                    tool_id: d.tool_id?.value ?? d.tool_id,
                    qty_send: Number(d.qty_send || 0),
                    qty_received: Number(d.qty_received || 0),
                    unit_price: Number(d.unit_price || 0),
                }));

                const invalidDetails = details.filter((d) => !d.tool_id || Number(d.qty_send) < 1);

                if (invalidDetails.length) {
                    toast.error("Each tool must have quantity at least 1");
                    return;
                }

                payload.details = details;

                const response = await createStockTransfer(payload).unwrap();
                if (response) {
                    toast.success("Stock transfer created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create stock transfer");
            }
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, tool_id, ...other } = data;

                let payload = normalizeSelectValues(other, [
                    "sender_warehouse_id",
                    "destination_warehouse_id",
                ]);

                if (
                    payload.sender_warehouse_id &&
                    typeof payload.sender_warehouse_id === "object"
                ) {
                    payload.sender_warehouse_id = payload.sender_warehouse_id.value;
                }

                if (
                    payload.destination_warehouse_id &&
                    typeof payload.destination_warehouse_id === "object"
                ) {
                    payload.destination_warehouse_id = payload.destination_warehouse_id.value;
                }

                const details = (payload.details || []).map((d) => ({
                    id: d.id ?? null,
                    tool_id: d.tool_id?.value ?? d.tool_id,
                    qty_send: Number(d.qty_send || 0),
                    qty_received: Number(d.qty_received || 0),
                    unit_price: Number(d.unit_price || 0),
                }));

                const invalidDetails = details.filter((d) => !d.tool_id || d.qty_send < 1);

                if (invalidDetails.length) {
                    toast.error("Each tool must have quantity at least 1");
                    return;
                }

                payload.details = details;

                const response = await updateStockTransfer({ id, ...payload }).unwrap();
                if (response) {
                    toast.success("Stock transfer updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update stock transfer");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this stock transfer?")) return;
                const response = await deleteStockTransfer(id).unwrap();
                if (response) {
                    toast.success("Stock transfer deleted successfully");
                    refetch();
                }
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },

        onEdit: (item) => {
            const totalQty = (item.details || []).reduce((sum, d) => sum + Number(d.qty_send || 0), 0);

            form.reset({
                id: item.id,
                transfer_date: item.transfer_date,
                transfer_status: item.transfer_status ?? "New",
                sender_warehouse_id: item.sender_warehouse
                    ? {
                          label: item.sender_warehouse.name,
                          value: item.sender_warehouse.id,
                      }
                    : null,
                warehouse_id: item.sender_warehouse_id,
                destination_warehouse_id: item.destination_warehouse
                    ? {
                          label: item.destination_warehouse.name,
                          value: item.destination_warehouse.id,
                      }
                    : null,
                total_send_item: totalQty,
                remarks: item.remarks || "",
                details: (item.details || []).map((d) => ({
                    id: d.id,
                    tool_id: d.tool_id,
                    tool_name: d.tool?.name || "",
                    available_stock: d.stock || 0,
                    qty_send: d.qty_send || 0,
                    qty_received: d.qty_received || 0,
                    unit_price: d.unit_price || 0,
                })),
            });

            form.setValue("openModel", true);
        },

        onSubmit: async (data) => {
            if (data?.id) await actions.onUpdate(data);
            else await actions.onCreate(data);
        },
    };

    return { actions, stockTransferState };
};
