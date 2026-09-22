const fields = () => {
    return [
        {
            name: "name",
            type: "input",
            label: "Punishment Type Name *",
            placeholder: "Enter punishment type name",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Punishment type name is required",
                maxLength: { value: 150, message: "Max 150 characters" },
            },
            inputProps: { maxLength: 150 },
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
