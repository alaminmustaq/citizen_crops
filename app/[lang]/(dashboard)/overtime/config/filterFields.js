
const filterFields = (form, actions) => {
    return [ 
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            loadOptions: ["organization/branches", "branches", "branchSearchTemplate"],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            loadOptions: ["organization/departments", "departments", "departmentSearchTemplate", ["branch_id"]],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            loadOptions: ["projects", "projects", "projectTemplate", ["branch_id"]],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "status",
            type: "select",
            label: "Status",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "amount_type",
            type: "select",
            label: "Amount Type",
            options: [
                { label: "Fixed", value: "fixed" },
                { label: "Basic", value: "basic" },
            ],
            colSpan: "col-span-12 md:col-span-3",
        }, 
    ];
};

export default filterFields;
