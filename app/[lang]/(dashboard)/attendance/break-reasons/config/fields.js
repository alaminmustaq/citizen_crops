const fields = () => [
    {
        name: "name",
        type: "text",
        label: "Break Reason Name *",
        placeholder: "Enter break reason name",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Break reason name is required" },
    },
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
