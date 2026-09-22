const fields = (form, user) => [
    {
        name: "date_from",
        type: "date",
        label: "From Date",
        colSpan: "col-span-12 md:col-span-3",
    },
    {
        name: "date_to",
        type: "date",
        label: "To Date",
        colSpan: "col-span-12 md:col-span-3",
    }, 
    ...(user?.role_id === 3 ? [] : [
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
    {
        name: "project_id",
        type: "async-select",
        label: "Project", 
        loadOptions: [
            "projects",
            "projects",
            "projectTemplate",
            "branch_id"
        ], 
        placeholder: "Optional",
        colSpan: "col-span-12 md:col-span-3",
    },
    {
        name: "salary_type", // renamed
        type: "select",
        label: "Salary type",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            {
                label: "Hourly",
                value: "hourly",
            },
            {
                label: "Monthly",
                value: "monthly",
            },
        ],  
    }, 
    ]),
    {
        name: "status",
        type: "select",
        label: "Attendance Status",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Present", value: "present" },
            { label: "Absent", value: "absent" },
            { label: "Late", value: "late" },
            { label: "Half Day", value: "half_day" },
            { label: "Work From Home", value: "work_from_home" },
            { label: "On Leave", value: "on_leave" },
        ],
    },
    ...(user?.role_id === 3 ? [] : [
        {
            name: "employee_ids",
            type: "multi-async-select",
            label: "Employees",
            loadOptions: ["hrm/employees", "employees", "employTemplate"], 
            colSpan: "col-span-12 md:col-span-3", 
        },  
    ]),
    // Future
    // {
    //     name: "status",
    //     type: "select",
    //     label: "Attendance Status",
    //     colSpan: "col-span-12 md:col-span-3",
    //     options: [
    //         { label: "Present", value: "present" },
    //         { label: "Absent", value: "absent" },
    //         // { label: "Late", value: "late" },
    //         // { label: "Early Departure", value: "early_departure" },
    //     ],
    // }, 
];

export default fields;