const filterFields = () => {
    return [
        {
            name: "shift_id",
            type: "async-select",
            label: "Shift *",
            colSpan: "col-span-12 md:col-span-4",

            // loadOptions: ["shifts", "shifts", "shiftTemplate"],
            loadOptions: [
                "schedule/employee_shift",
                "employee_shifts",
                "shiftSearchTemplate",
            ],
        },
        {
            name: "type",
            type: "select",
            label: "Shift Type *",
            placeholder: "Select shift type",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Day Shift", value: "day" },
                { label: "Night Shift", value: "night" },
            ],
        },
        {
            name: "status",
            type: "select",
            label: "Status *",
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
