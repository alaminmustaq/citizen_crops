const fields = () => [
    {
        name: "reason",
        type: "textarea",
        label: "Reason *",
        placeholder: "Write the updated reason",
        colSpan: "col-span-12",
        rules: {
            required: "Reason is required",
            maxLength: {
                value: 1000,
                message: "Reason must be at most 1000 characters",
            },
        },
    },
];

export default fields;
