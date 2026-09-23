const fields = (form) => [
    // ===== Warehouse Basic Info =====
    {
        name: "name",
        type: "text",
        label: "Name *",
        placeholder: "Enter name",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Name is required" },
    },

    // ===== Transaction Type Selection =====
    {
        name: "transaction_for",
        type: "select",
        label: "Transaction For *",
        options: [
            { label: "Income", value: "income" },
            { label: "Expense", value: "expense" },
        ],
        placeholder: "Select Transaction Type",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Transaction For is required" },
    },

    // ===== Status Selection =====
    {
        name: "status",
        type: "select",
        label: "Status *",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
        placeholder: "Select status",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Status is required" },
    },
];

export default fields;
