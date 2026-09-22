const filterFields = (form) => {
   
    return [
        // =============== Core ===============
        {
            name: "document_for",
            type: "select",
            label: "Document For",
            colSpan: "col-span-12 md:col-span-4",
            placeholder: "Select document type",
            options: [
                { label: "Employee", value: "employee" },
                { label: "Client", value: "client" },
            ],
           
        },
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
            colSpan: "col-span-12 md:col-span-4",
        },

    ];
};

export default filterFields;
