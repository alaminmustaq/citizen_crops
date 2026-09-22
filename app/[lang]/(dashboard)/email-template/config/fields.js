const fields = (formValues = {}) => {
    const isDefault = formValues?.type === "default";
    const isEdit = !!formValues?.id;

    return [
        {
            name: "template_name",
            type: "input",
            label: "Template Name *",
            placeholder: "Enter template name",
            colSpan: "col-span-12",
            rules: {
                required: "Template name is required",
                maxLength: {
                    value: 255,
                    message: "Max 255 characters",
                },
            },
            inputProps: {
                maxLength: 255,
                disabled: isDefault && isEdit,
            },
        },
        {
            name: "subject",
            type: "input",
            label: "Subject *",
            placeholder: "Enter email subject",
            colSpan: "col-span-12",
            rules: {
                required: "Subject is required",
                maxLength: {
                    value: 255,
                    message: "Max 255 characters",
                },
            },
            inputProps: {
                maxLength: 255,
            },
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
            name: "message",
            type: "rich-text",
            label: "Message",
            placeholder: "Enter email message body...",
            colSpan: "col-span-12",
        },
    ];
};

export default fields;
