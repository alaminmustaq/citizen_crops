const filterFields = (form) => [
    {
        name: "branch_id",
        type: "async-select",
        label: "Branch",
        loadOptions: [
            "organization/branches",
            "branches",
            "branchSearchTemplate",
        ],
        placeholder: "Select",
        colSpan: "col-span-12 md:col-span-3",
    },
    {
        name: "department_id",
        type: "async-select",
        label: "Department",
        colSpan: "col-span-12 md:col-span-3",
        loadOptions: [
            "organization/departments",
            "departments",
            "departmentSearchTemplate",
            "branch_id",
        ],
    },
    {
        name: "job_position_id",
        type: "async-select",
        label: "Job Position",
        colSpan: "col-span-12 md:col-span-3",
        loadOptions: [
            "organization/job-positions",
            "job_positions",
            "jobPositionsTemplate",
            "department_id",
        ],
    },
    {
        name: "role_id",
        type: "async-select",
        label: "Role",
        colSpan: "col-span-12 md:col-span-3",
        loadOptions: ["admin/roles-permissions/roles", "roles", "roleTemplate"],
    },
    {
        name: "gender",
        type: "select",
        label: "Gender",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
            {
                label: "Prefer not to say",
                value: "prefer_not_to_say",
            },
        ],
    },
    {
        name: "salary_type",
        type: "select",
        label: "Salary Type",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Hourly", value: "hourly" },
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Yearly", value: "yearly" },
            { label: "Annual", value: "annual" },
        ],
    },
    {
        name: "employee_type_id",
        type: "async-select",
        label: "Employee Type *",
        colSpan: "col-span-12 md:col-span-3",
        loadOptions: [
            "schedule/employee_type",
            "employee_types",
            "employeeTypeSearchTemplate",
        ],
    },
    {
        name: "work_mode",
        type: "select",
        label: "Work Mode",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Office", value: "office" },
            { label: "Remote", value: "remote" },
            { label: "Hybrid", value: "hybrid" },
        ],
    },

    {
        name: "employment_status",
        type: "select",
        label: "Status",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Probation", value: "probation" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Notice Period", value: "notice_period" },
            { label: "Terminated", value: "terminated" },
            { label: "Resigned", value: "resigned" },
            { label: "Retired", value: "retired" },
            { label: "Suspended", value: "suspended" },
            { label: "On Leave", value: "on_leave" },
        ],
    },
    {
        name: "employee_ids",
        type: "multi-async-select",
        label: "Employee",

        loadOptions: ["hrm/employees", "employees", "employTemplate"],
        colSpan: "col-span-12 md:col-span-3",
    },
];

export default filterFields;
