const fields = (form) => [
    // ===== Holiday Reason Info =====
    {
        name: "name",
        type: "text",
        label: "Holiday Reason Name *",
        placeholder: "Enter Holiday reason name",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Holiday reason name is required" },
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
