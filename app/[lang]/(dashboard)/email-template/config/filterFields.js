const filterFields = () => {
    return [
        {
            name: "template_name",
            type: "input",
            label: "Template Name",
            placeholder: "Search by template name",
            colSpan: "col-span-12 md:col-span-4",
        },
        {
            name: "subject",
            type: "input",
            label: "Subject",
            placeholder: "Search by subject",
            colSpan: "col-span-12 md:col-span-4",
        },
        {
            name: "status",
            type: "select",
            label: "Status",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];
};

export default filterFields;
