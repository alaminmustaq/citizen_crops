const fields = [
    // =============== Relations ===============

    {
        name: "parent_branch_id",
        type: "async-select",
        label: "Parent Branch",
        loadOptions: [
            "organization/branches",
            "branches",
            "branchSearchTemplate",
        ],
        placeholder: "Optional",
        colSpan: "col-span-12 md:col-span-6",
    },

    // =============== Core Info ===============
    {
        name: "name",
        type: "input",
        label: "Branch Name *",
        placeholder: "New York HQ",
        colSpan: "col-span-12 md:col-span-6",
        rules: {
            required: "Branch name is required",
            maxLength: { value: 200, message: "Max 200 characters" },
        },
    },
    {
        name: "code",
        type: "input",
        label: "Branch Code *",
        placeholder: "BR-001",
        colSpan: "col-span-12 md:col-span-6",
        rules: {
            required: "Branch code is required",
            maxLength: { value: 20, message: "Max 20 characters" },
        },
    },
    {
        name: "description",
        type: "textarea",
        label: "Description",
        placeholder: "Overview of the branch...",
        colSpan: "col-span-12",
    },
    {
        name: "hierarchy_level",
        type: "number",
        label: "Hierarchy Level *",
        placeholder: "1",
        colSpan: "col-span-12 md:col-span-6",
        inputProps: { min: 1, step: "1" },
        rules: {
            required: "Hierarchy level is required",
            min: { value: 1, message: "Must be ≥ 1" },
        },
    },
    {
        name: "hierarchy_path",
        type: "input",
        label: "Hierarchy Path",
        placeholder: "/1/2/5",
        colSpan: "col-span-12 md:col-span-6",
        inputProps: { maxLength: 500 },
        rules: { maxLength: { value: 500, message: "Max 500 characters" } },
    },

    {
        name: "type",
        type: "select",
        label: "Type *",
        colSpan: "col-span-12 md:col-span-6",
        options: [
            { label: "Branch", value: "branch" },
            { label: "Division", value: "division" },
            { label: "Subsidiary", value: "subsidiary" },
        ],
        rules: { required: "Type is required" },
    },

    // =============== Contact ===============
    {
        name: "email",
        type: "email",
        label: "Branch Email",
        placeholder: "branch@example.com",
        colSpan: "col-span-12 md:col-span-6",
        rules: { maxLength: { value: 100, message: "Max 100 characters" } },
    },
    {
        name: "phone",
        type: "input",
        label: "Phone",
        placeholder: "+1-555-123456",
        colSpan: "col-span-12 md:col-span-6",
        rules: { maxLength: { value: 50, message: "Max 50 characters" } },
    },
    {
        name: "fax",
        type: "input",
        label: "Fax",
        placeholder: "Optional",
        colSpan: "col-span-12 md:col-span-6",
        rules: { maxLength: { value: 50, message: "Max 50 characters" } },
    },

    // =============== Operations ===============
    {
        name: "latitude",
        type: "input",
        label: "Latitude",
        placeholder: "e.g. 23.8103",
        colSpan: "col-span-12 md:col-span-6",
    },

    {
        name: "longitude",
        type: "input",
        label: "Longitude",
        placeholder: "e.g. 90.4125",
        colSpan: "col-span-12 md:col-span-6",
    },
    {
        name: "allowed_range_meters",
        type: "number",
        label: "Allowed Range (Meters)",
        placeholder: "e.g. 100",
        colSpan: "col-span-12 md:col-span-6",
        inputProps: { min: 0, step: "1" },
        rules: {
            min: { value: 0, message: "Must be ≥ 0" },
        },
    },
    {
        name: "time_zone",
        type: "input",
        label: "Time Zone",
        placeholder: "UTC",
        colSpan: "col-span-12 md:col-span-6",
    },
    {
        name: "opening_time",
        type: "time",
        label: "Opening Time",
        inputProps: { type: "time" },
        colSpan: "col-span-12 md:col-span-6",
    },
    {
        name: "closing_time",
        type: "time",
        label: "Closing Time",
        inputProps: { type: "time" },
        colSpan: "col-span-12 md:col-span-6",
    },
    {
        name: "operating_days",
        type: "multiselect",
        label: "Operating Days",
        colSpan: "col-span-12 md:col-span-6",
        options: [
            { label: "Sunday", value: "sun" },
            { label: "Monday", value: "mon" },
            { label: "Tuesday", value: "tue" },
            { label: "Wednesday", value: "wed" },
            { label: "Thursday", value: "thu" },
            { label: "Friday", value: "fri" },
            { label: "Saturday", value: "sat" },
        ],
    },
    {
        name: "max_employees",
        type: "number",
        label: "Max Employees",
        placeholder: "100",
        colSpan: "col-span-12 md:col-span-6",
        inputProps: { min: 0, step: "1" },
        rules: { min: { value: 0, message: "Must be ≥ 0" } },
    },

    // =============== Classification ===============
    {
        name: "branch_type",
        type: "select",
        label: "Branch Type *",
        colSpan: "col-span-12 md:col-span-6",
        options: [
            { label: "Headquarters", value: "headquarters" },
            { label: "Main Office", value: "main_office" },
            { label: "Branch Office", value: "branch_office" },
            { label: "Sales Office", value: "sales_office" },
            { label: "Service Center", value: "service_center" },
            { label: "Warehouse", value: "warehouse" },
        ],
        rules: { required: "Branch type is required" },
    },
    {
        name: "status",
        type: "select",
        label: "Status *",
        colSpan: "col-span-12 md:col-span-6",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Suspended", value: "suspended" },
            { label: "Closed", value: "closed" },
        ],
        rules: { required: "Status is required" },
    },
    {
        name: "is_headquarters",
        type: "checkbox",
        label: "Is Headquarters",
        colSpan: "col-span-12 md:col-span-6",
    },
    {
        name: "established_date",
        type: "date",
        label: "Established Date",
        colSpan: "col-span-12 md:col-span-6",
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
            min: { value: 0, message: "Must be ≥ 0" },
        },
    },
];

export default fields;
