const monthOptions = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
];

const filterFields = () => {
    return [
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select branch",
            colSpan: "col-span-12 md:col-span-4",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
                ["branch_id"],
            ],
            placeholder: "Select project",
            colSpan: "col-span-12 md:col-span-4",
        },
        {
            name: "year",
            type: "number",
            label: "Year",
            placeholder: "Year",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { min: 2000, max: 2100 },
        },
        {
            name: "month",
            type: "select",
            label: "Month",
            placeholder: "Select month",
            colSpan: "col-span-12 md:col-span-4",
            options: monthOptions,
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
