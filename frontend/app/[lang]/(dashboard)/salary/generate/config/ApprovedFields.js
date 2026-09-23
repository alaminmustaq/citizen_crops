export default function ApprovedFields() {
    return [
        // =============== Branch ===============
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            loadOptions: [
                "organization/branches",   // API endpoint
                "branches",                // data key
                "branchSearchTemplate",    // mapping/template function
            ],
            placeholder: "Select branch",
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Branch is required" },
        },

        // =============== Department ===============
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
            ],
            placeholder: "Select department",
            colSpan: "col-span-12 md:col-span-6",
        },

        // =============== Salary Month ===============
        {
            name: "salary_month",
            type: "input",
            label: "Salary Month *",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { type: "month" },
            rules: { required: "Salary month is required" },
        }, 

        // =============== Admin Status ===============
        {
            name: "admin_status",
            type: "select",
            label: "Admin Status *",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
            ],
            rules: { required: "Admin Status is required" },
        },

        // =============== Notes ===============
        {
            name: "notes",
            type: "textarea",
            label: "Notes",
            placeholder: "Optional notes for this salary record…",
            colSpan: "col-span-12",
        },
    ];
}
