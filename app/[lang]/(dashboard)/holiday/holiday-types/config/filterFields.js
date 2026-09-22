const fields = () => {
    return [
            {
            name: "holiday_type_id",
            type: "async-select",
            label: "Holiday Type *",
            loadOptions: [
                "holiday/holiday_type",
                "holiday_types",
                "leaveTypeSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            
        }, 
        {
            name: "status",
            type: "select",
            label: "Status *",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
        
       
    ];
};

export default fields;
