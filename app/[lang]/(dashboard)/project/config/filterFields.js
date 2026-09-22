const filterFields = () => {
    return [
        // =============== Core ===============
       
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Branch",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "status",
            type: "select",
            label: "Status",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "Planned", value: "planned" },
                { label: "In Progress", value: "in_progress" },
                { label: "On Hold", value: "on_hold" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
            ],
        },

        // =============== Dates ===============
        {
            name: "start_date",
            type: "date",
            label: "Start Date",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date",
            colSpan: "col-span-12 md:col-span-3",
        },

        {
            name: "client_id",
            type: "async-select",
            label: "Client",
            loadOptions: [
                "clients/clients",
                "clients",
                "clientTemplate",
                "branch_id",
            ],
            placeholder: "Select client",
            colSpan: "col-span-12 md:col-span-3",
        },

        {
            name: "employee_id",
            type: "multi-async-select",
            label: "Responsible Employee",

            loadOptions: [
                "hrm/employees",
                "employees",
                "employTemplate",
            ],
            placeholder: "Select Employee",
            colSpan: "col-span-12 md:col-span-3",
        },
    ];
};

export default filterFields;
