const fields = (form) => [
    {
        name: "month_from",
        type: "month",
        label: "From Month",
        colSpan: "col-span-12 md:col-span-3",
        inputProps: { type: "month" }, 
    },
    {
        name: "month_to",
        type: "month",
        label: "To Month",
        colSpan: "col-span-12 md:col-span-3",
        inputProps: { type: "month" }, 
    },

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
        loadOptions: ["organization/departments", "departments", "departmentSearchTemplate", "branch_id"],
        colSpan: "col-span-12 md:col-span-3",
    },
    // Future
    // {
    //     name: "project_id",
    //     type: "async-select",
    //     label: "Project", 
    //     loadOptions: [
    //         "projects",
    //         "projects",
    //         "projectTemplate",
    //     ], 
    //     placeholder: "Optional",
    //     colSpan: "col-span-12 md:col-span-3",
    // },
    {
        name: "employee_ids",
        type: "multi-async-select",
        label: "Employees",
        loadOptions: ["hrm/employees", "employees", "employTemplate"], 
        colSpan: "col-span-12 md:col-span-3", 
    },   
];

export default fields;