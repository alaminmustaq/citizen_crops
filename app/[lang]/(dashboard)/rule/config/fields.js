const fields = () => [
    {
        name: "min_age",
        type: "number",
        label: "Minimum Employee Age",
        placeholder: "Enter minimum age",
        colSpan: "col-span-12 md:col-span-3",
        inputProps: { min: 0, step: "1" },
        rules: {
            required: "Minimum age is required",
            min: { value: 0, message: "Minimum age cannot be negative" },
        },
    },
    {
        name: "max_age",
        type: "number",
        label: "Maximum Employee Age",
        placeholder: "Enter maximum age",
        colSpan: "col-span-12 md:col-span-3",
        inputProps: { min: 0, step: "1" },
        rules: {
            required: "Maximum age is required",
            min: { value: 0, message: "Maximum age cannot be negative" },
        },
    },
];

export default fields;
