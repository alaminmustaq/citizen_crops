const filterFields = () => {
    return [
        {
            name: "leave_type_id",
            type: "async-select",
            label: "Leave Type",
            loadOptions: [
                "leave/leave_type",
                "leave_types",
                "leaveTypeSearchTemplate",
            ],
            colSpan: "col-span-12 md:col-span-3",
        },

        {
            name: "is_paid",
            type: "select",
            label: "Type",
            placeholder: "Select type",
            colSpan: "col-span-12 md:col-span-3",
            options: [
                { label: "Paid Leave", value: "paid" },
                { label: "Unpaid Leave", value: "unpaid" },
            ],
        },

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
