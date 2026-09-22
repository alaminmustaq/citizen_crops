const fields = () => {
    return [
        {
            name: "name",
            type: "input",
            label: "Leave Type Name *",
            placeholder: "Enter leave type name",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Leave type name is required",
                maxLength: { value: 150, message: "Max 150 characters" },
            },
            inputProps: { maxLength: 150 },
        },
        {
            name: "days_per_year",
            type: "input", 
            label: "Days Per Year *",
            placeholder: "Enter allowed days per year",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Days per year is required",
                min: { value: 0, message: "Must be 0 or greater" },
            },
            inputProps: { type: "number", min: 0, max:365, },
        },
        {
            name: "status",
            type: "select",
            label: "Status *",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            rules: {
                required: "Status is required",
            },
        },
        {
            name: "is_paid",
            type: "select",
            label: "Type *",
            placeholder: "Select type",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Paid Leave", value: "paid" },
                { label: "Unpaid Leave", value: "unpaid" }
            ],
            rules: {
                required: "Type is required",
            },
        },
        {
            name: "description",
            type: "textarea",
            label: "Description",
            placeholder: "Optional description",
            colSpan: "col-span-12",
            rules: {
                maxLength: { value: 500, message: "Max 500 characters" },
            },
        },
    ];
};

export default fields;
