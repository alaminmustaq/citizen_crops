const fields = () => [
    {
        name: "name",
        type: "input",
        label: "Tool Name *",
        placeholder: "Enter tool name",
        colSpan: "col-span-12 md:col-span-6",
        rules: {
            required: "Tool name is required",
            maxLength: { value: 150, message: "Max 150 characters" },
        },
        inputProps: { maxLength: 150 },
    },
    {
        name: "sku",
        type: "input",
        label: "SKU",
        placeholder: "Enter SKU",
        colSpan: "col-span-12 md:col-span-6",
        inputProps: { maxLength: 100 },
    },
    {
        name: "opening_date",
        type: "input",
        label: "Opening Date",
        placeholder: "Select opening date",
        colSpan: "col-span-12 md:col-span-6",
        inputProps: { type: "date" },
    },
    {
        name: "category_id",
        type: "async-select",
        label: "Category *",
        loadOptions: [
            "inventory/tool-categories",
            "categories",
            "categorySearchTemplate",
        ],
        placeholder: "Select category",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Category is required" },
    },
    {
        name: "current_quantity",
        type: "input",
        label: "Opening Quantity",
        placeholder: "Enter opening quantity",
        colSpan: "col-span-12 md:col-span-6",
        rules: { 
            min: { value: 0, message: "Cannot be negative" },
        },
        inputProps: { type: "number", min: 0 },
    },
    {
        name: "minimum_quantity",
        type: "input",
        label: "Minimum Quantity",
        placeholder: "Enter minimum quantity",
        colSpan: "col-span-12 md:col-span-6",
        rules: {
            min: { value: 0, message: "Cannot be negative" },
        },
        inputProps: { type: "number", min: 0 },
    },
    {
        name: "unit_price",
        type: "input",
        label: "Unit Price *",
        placeholder: "Enter unit price",
        colSpan: "col-span-12 md:col-span-6",
        rules: {
            required: "Unit price is required",
            min: { value: 0, message: "Cannot be negative" },
        },
        inputProps: { type: "number", min: 0, step: "0.01" },
    },

    {
        name: "unit_id",
        type: "async-select",
        label: "Unit of Measure *",
        loadOptions: ["inventory/tool-units", "units", "unitSearchTemplate"],
        placeholder: "Select unit",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Unit of measure is required" }, // Added
    },
    // {
    //   name: "location",
    //   type: "input",
    //   label: "Location",
    //   placeholder: "Enter location",
    //   colSpan: "col-span-12 md:col-span-6",
    // },
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
        rules: { required: "Status is required" },
    },
    {
        name: "description",
        type: "textarea",
        label: "Description",
        placeholder: "Enter description",
        colSpan: "col-span-12",
    },
    {
        name: "notes",
        type: "textarea",
        label: "Notes",
        placeholder: "Enter notes",
        colSpan: "col-span-12",
    },
];

export default fields;
