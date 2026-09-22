const fields = (form) => [
    // From Date
    {
        name: "date_from",
        type: "date",
        label: "From Date",
        colSpan: "col-span-12 md:col-span-3",
    },

    // To Date
    {
        name: "date_to",
        type: "date",
        label: "To Date",
        colSpan: "col-span-12 md:col-span-3",
    },

    // Branch
    {
        name: "branch_id",
        type: "async-select",
        label: "Branch",
        loadOptions: [
            "organization/branches",
            "branches",
            "branchSearchTemplate",
        ],
        placeholder: "Select Branch",
        colSpan: "col-span-12 md:col-span-3",
    },

    // Warehouse
    {
        name: "warehouse_id",
        type: "async-select",
        label: "Warehouse",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        placeholder: "Select Warehouse",
        colSpan: "col-span-12 md:col-span-3",
    },

    // Tool (Multiple)
    {
        name: "tool_ids",
        type: "multi-async-select",
        label: "Tools",
        loadOptions: [
            "inventory/tools",
            "tools",
            "toolSearchTemplate",
            "warehouse_id",
        ],
        placeholder: "Select Tools",
        colSpan: "col-span-12 md:col-span-3",
    },

    // Unit Price
    {
        name: "unit_price",
        type: "number",
        label: "Unit Price",
        placeholder: "Unit Price",
        colSpan: "col-span-12 md:col-span-3",
    },

    // Quantity
    {
        name: "quantity",
        type: "number",
        label: "Quantity",
        placeholder: "Quantity",
        colSpan: "col-span-12 md:col-span-3",
    },

    // Total Price
    {
        name: "total_price",
        type: "number",
        label: "Total Price",
        placeholder: "Total Price",
        colSpan: "col-span-12 md:col-span-3",
    },
];

export default fields;
