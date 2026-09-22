const fields = () => {
    return [
        {
            name: "name",
            type: "input",
            label: "Allowance Name *",
            placeholder: "Enter holiday type name",
            colSpan: "col-span-12",
            rules: {
                required: "Holiday type name is required",
                maxLength: { value: 150, message: "Max 150 characters" },
            },
            inputProps: { maxLength: 150 },
        }, 
        {
            name: "type",
            type: "select",
            label: "Type *",
            placeholder: "Select type",
            colSpan: "col-span-12",
            options: [
                { label: "Earning", value: "earning" },
                { label: "Deduction", value: "deduction" },
            ],
            rules: {
                required: "Type is required",
            },
        }, 
        {
            name: "status",
            type: "select",
            label: "Status *",
            placeholder: "Select status",
            colSpan: "col-span-12",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            rules: {
                required: "Status is required",
            },
        },  
    ];
};

export default fields;
