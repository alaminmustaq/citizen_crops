import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
} from "@/utility/helpers";
import {
    useCreatePurchaseMutation,
    useUpdatePurchaseMutation,
    useDeletePurchaseMutation,
    useFetchPurchasesQuery,
} from "../services/purchaseApi";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import {
    purchaseSearchTemplate,
    toolSearchTemplate,
    warehouseSearchTemplate,
} from "@/utility/templateHelper";

export const usePurchase = () => {
    // ===== RTK Query hooks =====
    const [createPurchase] = useCreatePurchaseMutation();
    const [updatePurchase] = useUpdatePurchaseMutation();
    const [deletePurchase] = useDeletePurchaseMutation();
    const {
        data: purchasesData,
        refetch,
        isFetching,
    } = useFetchPurchasesQuery();

    // ===== React Hook Form setup =====
    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: { details: [] }, // Field array default
    });

    const fieldArray = useFieldArray({
        control: form.control,
        name: "details",
    });

    const purchaseState = {
        data: purchasesData?.data?.purchases || [],
        form: { ...form, fields: fieldArray },
        refetch,
        isFetching,
    };

    // ===== Actions =====
    const actions = {
        onCreate: async (data) => {
            try {
                // Remove UI-specific fields
                const { openModel, tool_id, ...other } = data;

                // Normalize select values
                let payload = normalizeSelectValues(other, [
                    "supplier_id",
                    "warehouse_id",
                ]);

                if (
                    payload.warehouse_id &&
                    typeof payload.warehouse_id === "object"
                ) {
                    payload.warehouse_id = payload.warehouse_id.value;
                }

                // Set default purchase status as string
                payload.purchase_status =
                    payload.purchase_status?.toString() ?? "completed";

                // Clean and map details
                const details = (payload.details || []).map((d) => ({
                    tool_id: d.tool_id?.value ?? d.tool_id,
                    unit_price: Number(d.unit_price || 0),
                    quantity: Number(d.quantity || 0),
                    total_price: Number(d.total_price || 0),
                    net_total_price: Number(
                        (d.net_total_price ?? d.total_price) || 0
                    ),
                    warehouse_id:
                        d.warehouse_id?.value ??
                        d.warehouse_id ??
                        payload.warehouse_id ??
                        null,
                }));

                // Validate details
                const invalidDetails = details.filter(
                    (d) => !d.tool_id || d.quantity < 1
                );

                if (invalidDetails.length) {
                    toast.error("Each tool must have quantity at least 1");
                    return;
                }

                payload.details = details;

                const response = await createPurchase(payload).unwrap();
                if (response) {
                    toast.success("Purchase created successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to create purchase");
            }
        },

        onUpdate: async (data) => {
            try {
                const { openModel, id, tool_id, ...other } = data;

                // Normalize select values
                let payload = normalizeSelectValues(other, [
                    "supplier_id",
                    "warehouse_id",
                ]);

                if (
                    payload.warehouse_id &&
                    typeof payload.warehouse_id === "object"
                ) {
                    payload.warehouse_id = payload.warehouse_id.value;
                }

                // Set default purchase status as string
                payload.purchase_status =
                    payload.purchase_status?.toString() ?? "completed";

                // Clean and map details
                const details = (payload.details || []).map((d) => ({
                    id: d.id ?? null,
                    tool_id: d.tool_id?.value ?? d.tool_id,
                    unit_price: Number(d.unit_price || 0),
                    quantity: Number(d.quantity || 0),
                    total_price: Number(d.total_price || 0),
                    net_total_price: Number(
                        (d.net_total_price ?? d.total_price) || 0
                    ),
                    warehouse_id:
                        d.warehouse_id?.value ??
                        d.warehouse_id ??
                        payload.warehouse_id ??
                        null,
                }));

                // Validation: each tool must have quantity >= 1
                const invalidDetails = details.filter(
                    (d) => !d.tool_id || d.quantity < 1
                );

                if (invalidDetails.length) {
                    toast.error("Each tool must have quantity at least 1");
                    return;
                }

                payload.details = details;

                const response = await updatePurchase({
                    id,
                    ...payload,
                }).unwrap();
                if (response) {
                    toast.success("Purchase updated successfully");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
                toast.error("Failed to update purchase");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this purchase?"))
                    return;
                const response = await deletePurchase(id).unwrap();
                if (response) {
                    toast.success("Purchase deleted successfully");
                    refetch();
                }
            } catch (error) {
                handleServerValidationErrors(error, form.setError);
            }
        },

        onEdit: (item) => {
            console.log(item);

            // Calculate totals from details
            const total_tool = (item.details || []).reduce(
                (sum, d) => sum + Number(d.quantity || 0),
                0
            );
            const total_purchase_amount = (item.details || []).reduce(
                (sum, d) => sum + Number(d.total_price || 0),
                0
            );

            form.reset({
                id: item.id,
                invoice_no: item.invoice_no,
                supplier_id: null, // you can map this later if supplier select is used
                company_id: item.company_id ?? null,
                warehouse_id: item.warehouse
                    ? { label: item.warehouse.name, value: item.warehouse.id }
                    : null,

                purchase_date: item.purchase_date,
                purchase_status: item.purchase_status || "pending",
                ref_no: item.ref_no || "",
                remarks: item.remarks || "",

                total_tool,
                total_purchase_amount,
                net_purchase_amount: total_purchase_amount, // usually same unless discount/tax applied

                details: (item.details || []).map((d) => ({
                    id: d.id,
                    tool_id: d.tool_id,
                    tool_name: d.tool?.name || "",
                    unit_price: d.unit_price || 0,
                    quantity: d.quantity || 0,
                    total_price: d.total_price || 0,
                    net_total_price: d.net_total_price || d.total_price || 0,
                    note: d.note || "",
                    warehouse_id: d.warehouse
                        ? { label: d.warehouse.name, value: d.warehouse_id }
                        : d.warehouse_id ?? null,
                })),
            });

            form.setValue("openModel", true);
        },

        onSubmit: async (data) => {
            if (data?.id) await actions.onUpdate(data);
            else await actions.onCreate(data);
        },
    };

    return { actions, purchaseState };
};
