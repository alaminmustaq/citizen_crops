import { toast } from "react-hot-toast";

const fields = (form) => [
    {
        name: "date",
        type: "input",
        label: "Damage Date *",
        inputType: "date",
        placeholder: "Select damage date",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Damage date is required" },
        inputProps: { type: "date" },
    },
        {
    name: "warehouse_id",
    type: "async-select",
    label: "Warehouse *",
    loadOptions: ["inventory/warehouses", "warehouses", "warehouseSearchTemplate"],
    placeholder: "Select Warehouse",
    colSpan: "col-span-12 md:col-span-6",
    // rules: { required: "Warehouse is required" },
  },

    {
        name: "note",
        type: "text",
        label: "Note",
        placeholder: "Enter damage note (optional)",
        colSpan: "col-span-12 md:col-span-6",
        rows: 3,
    },
    {
        name: "tool_id",
        type: "async-select",
        label: "Tool ",
        loadOptions: ["inventory/tools", "tools", "toolSearchTemplate","warehouse_id"],
        placeholder: "Select tool",
        colSpan: "col-span-12 md:col-span-12",
        rules: { required: "Tool is required" },
        handleChange: (e, form, field, allData) => {
            const existingTool = form.getValues("damageTools") || [];
            const exists = existingTool.some(
                (tool) => tool.tool_id === e.value
            );
            const rawData = allData.find((item) => item.value === e.value);

            if (exists) {
                toast.error("Tool already added!");
            } else {
                form.fields.append({
                    tool_name: e.label,
                    tool_id: e.value,
                    available_stock: rawData?.stock ?? 0,
                    quantity: 1,
                    unit_price: rawData?.unit_price ?? 0,
                    note: "",
                });
            }
            field.onChange(null);
        },
    },
    // =============== Damage Tools ===============
    {
        name: "damageTools",
        type: "group-form",
        label: "Damage Tools",
        placeholder: "Add tool",
        colSpan: "col-span-12",
        addButtonLabel: false,

        fields: [
            {
                name: "tool_name",
                type: "text",
                label: "Tool Name *",
                placeholder: "Enter tool name",
                colSpan: "col-span-12 md:col-span-3",
                rules: {
                    required: "Tool name is required",
                },
                disabled: true,
            },
            {
                name: "available_stock",
                type: "number",
                label: "Available Stock",
                placeholder: "Available stock",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    min: {
                        value: 0,
                        message: "Stock cannot be negative",
                    },
                },
                disabled: true,
            },
            {
                name: "quantity",
                type: "number",
                label: "Quantity *",
                placeholder: "Enter damage quantity",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    required: "Quantity is required",
                    min: {
                        value: 1,
                        message: "Quantity must be at least 1",
                    },
                },
            },
            {
                name: "unit_price",
                type: "number",
                label: "Unit Price *",
                placeholder: "Enter unit price",
                colSpan: "col-span-12 md:col-span-2",
                rules: {
                    required: "Unit price is required",
                    min: {
                        value: 0,
                        message: "Unit price cannot be negative",
                    },
                },
                step: 0.01,
            },
            {
                name: "note",
                type: "text",
                label: "Note",
                placeholder: "Enter damage note (optional)",
                colSpan: "col-span-12 md:col-span-3",
                rules: {
                    maxLength: {
                        value: 255,
                        message: "Note cannot exceed 255 characters",
                    },
                },
            },
        ],
    },
];

export default fields;
