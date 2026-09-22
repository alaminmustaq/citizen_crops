const monthOptions = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
];

const fields = (form) => [
    {
        name: "bonus_type_id",
        type: "async-select",
        label: "Bonus Type *",
        placeholder: "Select bonus type first",
        colSpan: "col-span-12 md:col-span-4",
        loadOptions: [
            "bonus/bonus_type",
            "bonus_types",
            "bonusTypeSearchTemplate",
        ],
        rules: { required: "Bonus type is required" },
        handleChange: (val, form, field) => {
            field?.onChange?.(val);
            if (form) form.setValue("bonus_name", null);
        },
    },
    {
        name: "bonus_name",
        type: "async-select",
        label: "Bonus Name (bonus type wise) *",
        placeholder: "Select bonus type first, then bonus name",
        colSpan: "col-span-12 md:col-span-4",
        loadOptions: [
            "bonus/process/bonus-names",
            "bonus_names",
            "bonusNameSearchTemplate",
            ["bonus_type_id"],
        ],
        rules: { required: "Bonus name is required" },
        disabled: (form) =>
            !(
                form?.watch?.("bonus_type_id")?.value ??
                form?.watch?.("bonus_type_id")
            ),
    },
    {
        name: "salary_type",
        type: "select",
        label: "Salary Type *",
        placeholder: "Select...",
        colSpan: "col-span-12 md:col-span-4",
        options: [
            { label: "Basic", value: "basic" },
            // { label: "Gross", value: "gross" },
        ],
        rules: { required: "Salary type is required" },
    },
    {
        name: "year",
        type: "number",
        label: "Year *",
        placeholder: "e.g. 2026",
        colSpan: "col-span-12 md:col-span-4",
        inputProps: { min: 2000, max: 2100, step: 1 },
        rules: { required: "Year is required" },
    },
    {
        name: "month",
        type: "select",
        label: "Month *",
        placeholder: "Select month",
        colSpan: "col-span-12 md:col-span-4",
        options: monthOptions,
        rules: { required: "Month is required" },
    },
    {
        name: "end_date",
        type: "date",
        label: "End Date *",
        placeholder: "Select end date",
        colSpan: "col-span-12 md:col-span-4",
        rules: { required: "End date is required" },
    },
];

export default fields;
