const fields = () => {
    return [
        // =============== Core ===============
        {
            name: "name",
            type: "input",
            label: "Document Type *",
            placeholder: "e.g. Passport, Driving License",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Document type name is required",
                maxLength: { value: 200, message: "Max 200 characters" },
            },
        },

        {
            name: "icon",
            type: "input",
            label: "Icon Name *",
            placeholder: "e.g. FileText, User, FolderOpen",
            colSpan: "col-span-12 md:col-span-6",
            note: "Enter a Lucide icon name. Browse at ",
            refLink: 'https://lucide.dev/icons/',
        },

        {
            name: "status",
            type: "select",
            label: "Status *",
            menuPlacement:'top',
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            rules: { required: "Status is required" },
        },
    ];
};

export default fields;
