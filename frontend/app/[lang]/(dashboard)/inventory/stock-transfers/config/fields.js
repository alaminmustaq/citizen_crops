import { toast } from "react-hot-toast";

const fields = (form) => [
    // ===== Stock Transfer Master Fields =====
    {
        name: "transfer_date",
        type: "input",
        label: "Transfer Date *",
        placeholder: "Select transfer date",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Transfer date is required" },
        inputProps: { type: "date" },
    },
    {
        name: "sender_warehouse_id",
        type: "async-select",
        label: "Sender Warehouse *",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        handleChange: (e, form) => {
            form.setValue("sender_warehouse_id", e);
            form.setValue("warehouse_id", e.value);
        },
        placeholder: "Select sender warehouse",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Sender warehouse is required" },
    },
    {
        name: "destination_warehouse_id",
        type: "async-select",
        label: "Destination Warehouse *",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        placeholder: "Select destination warehouse",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Destination warehouse is required" },
    },

    {
        name: "remarks",
        type: "text",
        label: "Remarks",
        placeholder: "Enter remarks (optional)",
        colSpan: "col-span-12 md:col-span-6",
    },

    // ===== Tool Dropdown to Add Transfer Items =====
    {
        name: "tool_id",
        type: "async-select",
        label: "Add Tool",
        loadOptions: [
            "inventory/tools",
            "tools",
            "toolSearchTemplate",
            "warehouse_id",
        ],
        placeholder: "Select tool to transfer",
        colSpan: "col-span-12 md:col-span-6",
        handleChange: (e, form, field, allData) => {
            const existingTools = form.getValues("details") || [];
            const exists = existingTools.some((t) => t.tool_id === e.value);

            if (exists) {
                toast.error("Tool already added!");
                return;
            }

            const rawData = allData.find((item) => item.value === e.value);

            form.fields.append({
                tool_id: e.value,
                tool_name: e.label,
                unit_price: rawData?.unit_price ?? 0,
                qty_send: 0,
                total_price: 0,
                available_stock: rawData?.stock ?? 0,
            });

            field.onChange(null); // reset dropdown
        },
    },

    // ===== Dynamic Tool Transfer Details =====
    {
        name: "details",
        type: "group-form",
        label: "Transfer Details",
        colSpan: "col-span-12",
        addButtonLabel: false,
        fields: [
            {
                name: "tool_name",
                type: "text",
                label: "Tool Name",
                colSpan: "col-span-12 md:col-span-4",
                disabled: true,
            },
            {
                name: "available_stock",
                type: "number",
                label: "Available Stock *",
                placeholder: "Available stock",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    required: "Available stock is required",
                    min: {
                        value: 0,
                        message: "Stock cannot be negative",
                    },
                },
                disabled: true,
            },
            {
                name: "unit_price",
                type: "number",
                label: "Unit Price",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    min: { value: 0, message: "Unit price cannot be negative" },
                },
                handleChange: (value, form, index) => {
                    const details = form.getValues("details") || [];
                    const unitPrice = Number(value || 0);
                    const qty_send = Number(
                        form.watch(`details.${index}.qty_send`) || 0
                    );
                    const totalPrice = unitPrice * qty_send;

                    form.setValue(`details.${index}.total_price`, totalPrice);
                    const totalQty = details.reduce(
                        (sum, item, i) =>
                            sum +
                            (i === index
                                ? qty_send
                                : Number(item.qty_send) || 0),
                        0
                    );
                    form.setValue("total_send_item", totalQty);
                },
            },
            {
                name: "qty_send", // ✅ changed from "quantity"
                type: "number",
                label: "Quantity *",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" },
                },
                handleChange: (value, form, index) => {
                    const details = form.getValues("details") || [];
                    const qty_send = Number(value || 0);
                    const unitPrice = Number(
                        form.watch(`details.${index}.unit_price`) || 0
                    );
                    const totalPrice = unitPrice * qty_send;

                    form.setValue(`details.${index}.total_price`, totalPrice);
                    const totalQty = details.reduce(
                        (sum, item, i) =>
                            sum +
                            (i === index
                                ? qty_send
                                : Number(item.qty_send) || 0),
                        0
                    );
                    form.setValue("total_send_item", totalQty);
                },
            },
        ],
    },

    // ===== Display Totals =====
    {
        name: "total_send_item",
        type: "text-display",
        colSpan: "col-span-12",
        getValue: (form) => (
            <div className="flex justify-end gap-4">
                <span className="w-48 text-right font-semibold">
                    Total Quantity Sent:
                </span>
                <span className="w-32 text-right break-all">
                    {form.watch("total_send_item") || 0}
                </span>
            </div>
        ),
    },
];

export default fields;
