const fields = (actions) => {
    return [
        // =============== Relations ===============
    
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",

            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Branch is required" },
        },  
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
     

        // =============== Salary Details ===============
        {
            name: "salary_month",
            type: "month",
            label: "Salary Month *",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { type: "month" }, // controlled by RHF
            rules: { required: "Salary month is required" },
        },
     
        // =============== Status ===============
        {
            name: "status",
            type: "select",
            label: "Status *",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Paid", value: "paid" },
            ],
            rules: { required: "Status is required" },
        },

        // =============== Additional Details ===============
        {
            name: "notes",
            type: "textarea",
            label: "Notes",
            placeholder: "Optional notes for this salary record…",
            colSpan: "col-span-12",
        },
    ];
};

export default fields;
