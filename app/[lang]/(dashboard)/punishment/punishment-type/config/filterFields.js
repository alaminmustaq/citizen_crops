const fields = () => {
    return [
        //     {
        //     name: "punishment_type_id",
        //     type: "async-select",
        //     label: "Punishment Type *",
        //     loadOptions: [
        //         "punishment/punishment_type",
        //         "punishment_types",
        //         "leaveTypeSearchTemplate",
        //     ],
        //     placeholder: "Select",
        //     colSpan: "col-span-12 md:col-span-4",
            
        // }, 
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

export default fields;
