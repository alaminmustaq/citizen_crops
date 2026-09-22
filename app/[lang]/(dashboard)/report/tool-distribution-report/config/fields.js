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
        name: "branch_id",
        type: "async-select",
        label: "Branch",
        loadOptions: [
            "organization/branches",
            "branches",
            "branchSearchTemplate",
        ],
        placeholder: "Select",
        colSpan: "col-span-12 md:col-span-3",
    },
    {
        name: "project_id",
        type: "async-select",
        label: "Project",
        loadOptions: ["projects", "projects", "projectTemplate", "branch_id"],
        placeholder: "Select Project",
        colSpan: "col-span-12 md:col-span-3",
    },

    {
        name: "employee_ids",
        type: "multi-async-select",
        label: "Employee",

        loadOptions: [
            "hrm/employees",
            "employees",
            "employTemplate",
            "project_id",
        ],
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
            "warehouse_filter_id",
        ],
        colSpan: "col-span-12 md:col-span-3",
    },

    {
        name: "status",
        type: "select",
        label: "Status",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Distributed", value: "distributed" },
            { label: "Returned", value: "returned" },
            { label: "Lost", value: "lost" },
            { label: "Damaged", value: "damaged" }, 
        ], 
    }, 
];

export default fields;
