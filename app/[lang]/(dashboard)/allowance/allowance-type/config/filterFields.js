const fields = () => {
    return [
            {
                name: "type",
                type: "select",
                label: "Type",
                placeholder: "Select type",
                colSpan: "col-span-12 md:col-span-6",
                options: [
                    { label: "Earning", value: "earning" },
                    { label: "Deduction", value: "deduction" },
                ]
            }, 
            {
                name: "status",
                type: "select",
                label: "Status",
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
