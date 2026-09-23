const fields = (form) => {
    const watchedValues = form.watch("document_for");
    console.log("Form values changed:", watchedValues);
    return [
        // =============== Core ===============
        {
            name: "document_for",
            type: "select",
            label: "Document For",
            colSpan: "col-span-12",
            placeholder: "Select document type",
            options: [
                { label: "Employee", value: "employee" },
                { label: "Client", value: "client" },
            ],
            rules: { required: "Please select a document type" },
        },
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            visibility: form.watch("document_for") === "employee",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "employee_id",
            type: "async-select",
            label: "Employee",
            visibility: form.watch("document_for") === "employee",
            loadOptions: [
                "hrm/employees",
                "employees",
                "employTemplate",
                "branch_id", // filter employees by branch
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        // ======== Client & Project ========
        {
            name: "client_id",
            type: "async-select",
            label: "Client",
            visibility: form.watch("document_for") === "client",
            loadOptions: [
                "clients/clients", 
                "clients",
                "clientTemplate",
            ],
            placeholder: "Select client",
            colSpan: "col-span-12 md:col-span-6",
        }, 
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            visibility: form.watch("document_for") === "client",
            loadOptions: [
                "/projects", 
                "projects",
                "projectTemplate",
                "client_id",
            ],
            placeholder: "Select project",
            colSpan: "col-span-12 md:col-span-6",
        },  

        {
            name: "document",
            type: "group-form",
            label: "Documents",
         
            fields: [
                {
                    name: "title",
                    type: "text",
                    label: "Document Title *",
                    placeholder: "Enter document title",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "type",
                    type: "async-select",
                    label: "Document Type *",
                    loadOptions: [
                        "document_management/document-type",
                        "document_types",
                        "documentTypeTemplate",
                    ],
                    placeholder: "Select document type",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "expiry_date",
                    type: "date",
                    label: "Expiry Date",
                    placeholder: "Select expiry date",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "expiry_warning",
                    type: "number",
                    label: "Expiry Warning (days)",
                    placeholder: "Enter days before expiry to warn",
                    colSpan: "col-span-12 md:col-span-6",
                },
                {
                    name: "file",
                    type: "file",
                    label: "Document File *",
                    placeholder: "Upload file",
                    colSpan: "col-span-12 md:col-span-6",
                },
            ],
            placeholder: "Optional",
            colSpan: "col-span-12",
        },
    ];
};

export default fields;
