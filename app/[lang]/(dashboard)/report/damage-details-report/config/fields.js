const fields = (form) => [
    {
        name: "date_from",
        type: "date",
        label: "From Date",
        colSpan: "col-span-12 md:col-span-3",
    },
    {
        name: "date_to",
        type: "date",
        label: "To Date",
        colSpan: "col-span-12 md:col-span-3",
    },
    {
        name: "warehouse_id",
        type: "async-select",
        label: "Warehouse *",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        placeholder: "Select Warehouse",
        colSpan: "col-span-12 md:col-span-3",
        // rules: { required: "Warehouse is required" },
    },
    {
        name: "tool_ids",
        type: "multi-async-select",
        label: "Tools", 
        loadOptions: [
            "inventory/tools",
            "tools",
            "toolSearchTemplate", 
            "warehouse_id"
        ],
        colSpan: "col-span-12 md:col-span-3", 
    },  

];

export default fields;
