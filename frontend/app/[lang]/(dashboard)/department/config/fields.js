const fields = () => {
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
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        }, 

        // =============== Core ===============
        {
            name: "name",
            type: "input",
            label: "Department Name *",
            placeholder: "Operations",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Name is required",
                maxLength: { value: 200, message: "Max 200 characters" },
            },
            inputProps: { maxLength: 200 },
        },
        {
            name: "department_type",
            type: "select",
            label: "Department type", // varchar(50), default 'department'
            placeholder: "Select type",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Technical", value: "technical" },
                { label: "Business", value: "business" },
                { label: "Support", value: "support" },
                { label: "Administ", value: "administ" },
            ], 
        },
        {
            name: "code",
            type: "input",
            label: "Department Code *",
            placeholder: "OPS-01",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Code is required",
                maxLength: { value: 20, message: "Max 20 characters" },
            },
            inputProps: { maxLength: 20 },
        },
        // {
        //     name: "manager_id",
        //     type: "async-select",
        //     label: "Select Manager",
        //     loadOptions: ["managers", "managers", "commonSearchTemplate"],
        //     colSpan: "col-span-12 md:col-span-6", 
        // },
        {
            name: "type",
            type: "select",
            label: "Type *", // varchar(50), default 'department'
            placeholder: "Select type",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Department", value: "department" },
                { label: "Division", value: "division" },
                { label: "Team", value: "team" },
                { label: "Unit", value: "unit" },
            ],
            rules: { required: "Type is required" },
        },
        {
            name: "description",
            type: "textarea",
            label: "Description",
            placeholder: "What this department is responsible for…",
            colSpan: "col-span-12",
        },

        // =============== Heads & Contacts ===============
        // {
        //     name: "head_of_department_id",
        //     type: "async-select",
        //     label: "Head of Department",

        //     placeholder: "Optional",
        //     colSpan: "col-span-12 md:col-span-6",
        // },
        // {
        //     name: "deputy_head_id",
        //     type: "async-select",
        //     label: "Deputy Head",

        //     placeholder: "Optional",
        //     colSpan: "col-span-12 md:col-span-6",
        // },
        {
            name: "email",
            type: "email",
            label: "Department Email",
            placeholder: "ops@example.com",
            colSpan: "col-span-12 md:col-span-6",
            rules: { maxLength: { value: 100, message: "Max 100 characters" } },
            inputProps: { maxLength: 100 },
        },
        {
            name: "phone",
            type: "input",
            label: "Phone",
            placeholder: "+1-555-123456",
            colSpan: "col-span-12 md:col-span-6",
            rules: { maxLength: { value: 50, message: "Max 50 characters" } },
            inputProps: { maxLength: 50 },
        },
        {
            name: "extension",
            type: "input",
            label: "Ext.",
            placeholder: "1234",
            colSpan: "col-span-12 md:col-span-6",
            rules: { maxLength: { value: 20, message: "Max 20 characters" } },
            inputProps: { maxLength: 20 },
        },

        // =============== Finance ===============
        {
            name: "is_billable",
            type: "checkbox",
            label: "Billable Department",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "is_cost_center",
            type: "checkbox",
            label: "Is Cost Center",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "cost_center_code",
            type: "input",
            label: "Cost Center Code",
            placeholder: "CC-100",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { maxLength: 20 },
            rules: { maxLength: { value: 20, message: "Max 20 characters" } },
        },
      

        // =============== Dates & Numbers ===============
        {
            name: "established_date",
            type: "date",
            label: "Established Date",
            colSpan: "col-span-12 md:col-span-6",
        }, 

        // =============== Hierarchy ===============
        {
            name: "hierarchy_level",
            type: "number",
            label: "Hierarchy Level *",
            placeholder: "1",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, step: "1" },
            rules: {
                required: "Hierarchy level is required",
                min: { value: 0, message: "Must be unsigned (≥ 0)" },
                max: { value: 255, message: "Too large for TINYINT UNSIGNED" },
            },
        },
        {
            name: "hierarchy_path",
            type: "input",
            label: "Hierarchy Path",
            placeholder: "/1/3/7",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { maxLength: 500 },
            rules: { maxLength: { value: 500, message: "Max 500 characters" } },
        },
        {
            name: "sort_order",
            type: "number",
            label: "Sort Order *",
            placeholder: "0",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, step: "1" },
            rules: {
                required: "Sort order is required",
                min: { value: 0, message: "Must be unsigned (≥ 0)" },
            },
        },

        // =============== Status ===============
        {
            name: "status",
            type: "select",
            label: "Status *",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Restructuring", value: "restructuring" },
                { label: "Dissolved", value: "dissolved" },
            ],
            rules: { required: "Status is required" },
        }, 
    ];
};

export default fields;
