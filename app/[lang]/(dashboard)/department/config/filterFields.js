const filterFields = () => {
    return [
        // =============== Relations ===============

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

        // =============== Core ===============
        // {
        //     name: "department_id",
        //     type: "async-select",
        //     label: "Department",
        //     loadOptions: [
        //         "organization/departments",
        //         "departments",
        //         "departmentSearchTemplate",
        //         "branch_id",
        //     ],
        //     placeholder: "Optional",
        //     colSpan: "col-span-12 md:col-span-6",
        // },
        {
            name: "department_type",
            type: "select",
            label: "Department type", // varchar(50), default 'department'
            placeholder: "Select type",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "Technical", value: "technical" },
                { label: "Business", value: "business" },
                { label: "Support", value: "support" },
            ],
        },

        // {
        //     name: "manager_id",
        //     type: "async-select",
        //     label: "Select Manager",
        //     loadOptions: ["managers", "managers", "commonSearchTemplate"],
        //     colSpan: "col-span-12 md:col-span-6",
        // },

        // =============== Status ===============
        {
            name: "status",
            type: "select",
            label: "Status",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];
};

export default filterFields;
