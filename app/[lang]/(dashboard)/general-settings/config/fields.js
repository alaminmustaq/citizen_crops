const fields = () => [
    {
        name: "company_name",
        type: "input",
        label: "Company Name *",
        placeholder: "Enter company name",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Company name is required" },
    },
    {
        name: "next_day_time",
        type: "input",
        label: "Next Day Time",
        placeholder: "06:00:00",
        colSpan: "col-span-12 md:col-span-6",
        // Setting input type to time in the component assumes standard HTML5 time support
        customType: "time",
    },
    {
        name: "is_12_hour_format",
        type: "select",
        label: "Time Format",
        placeholder: "Select time format",
        colSpan: "col-span-12 md:col-span-6",
        options: [
            { label: "24 Hour", value: 0 },
            { label: "12 Hour (AM/PM)", value: 1 },
        ],
    },
    {
        name: "allowed_file_types",
        type: "multi-select",
        label: "Allowed File Types",
        placeholder: "Select File Types",
        colSpan: "col-span-12 md:col-span-6",
        options: [
            { label: "jpg", value: "jpg" },
            { label: "png", value: "png" },
            { label: "pdf", value: "pdf" },
            { label: "webp", value: "webp" },
        ],
    },

    // --- FILE UPLOADS ---
    {
        name: "icon",
        type: "file",
        label: "App Icon",
        placeholder: "Upload app icon",
        colSpan: "col-span-12 md:col-span-4",
        accept: "image/*",
    },
    {
        name: "logo",
        type: "file",
        label: "Company Logo",
        placeholder: "Upload company logo",
        colSpan: "col-span-12 md:col-span-4",
        accept: "image/*",
    },
    {
        name: "favicon",
        type: "file",
        label: "Favicon",
        placeholder: "Upload favicon",
        colSpan: "col-span-12 md:col-span-4",
        accept: "image/*",
    },
];

export default fields;
