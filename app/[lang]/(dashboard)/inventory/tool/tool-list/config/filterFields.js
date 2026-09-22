const filterFields = (form) => [
    
    {
        name: "warehouse_filter_id",
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

    {
        name: "tool_ids",
        type: "multi-async-select",
        label: "Tools", 
        loadOptions: [
            "inventory/tools",
            "tools",
            "toolSearchTemplate", 
        ],
        colSpan: "col-span-12 md:col-span-3", 
    },  
    {
        name: "category_id",
        type: "async-select",
        label: "Category",
        loadOptions: [
            "inventory/tool-categories",
            "categories",
            "categorySearchTemplate",
        ],
        placeholder: "Select category",
        colSpan: "col-span-12 md:col-span-3", 
    },     
    {
        name: "status",
        type: "select",
        label: "Status",
        placeholder: "Select status",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ], 
    }, 
    
];

export default filterFields;