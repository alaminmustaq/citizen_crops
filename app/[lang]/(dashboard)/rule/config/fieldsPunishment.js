const latePunishmentFields = (form) => [
    {
        name: "max_late_days",
        type: "number",
        label: "Maximum Late Days *",
        colSpan: "col-span-12 md:col-span-4",
        inputProps: { min: 0, step: "0.01", type: "number" },
    },
    {
        name: "late_punishment_type",
        type: "select",
        label: "Late Punishment Type *",
        placeholder: "Select late punishment type",
        colSpan: "col-span-12 md:col-span-4",
        options: [
            { label: "Fixed Amount", value: "fixed" },
            { label: "Basic Salary (1 Day)", value: "basic" },
            { label: "Gross Salary (1 Day)", value: "gross" },
        ],
        handleChange: (e) => {
            form.setValue("late_punishment_type", e.value);

            if (e.value !== "fixed") {
                form.setValue("late_punishment_amount", null);
            }
        },
        rules: { required: "Late punishment type is required" },
    },
    {
        name: "late_punishment_amount",
        type: "number",
        label: "Late Punishment Amount",
        colSpan: "col-span-12 md:col-span-4",
        visibility: form.watch("late_punishment_type") === "fixed",
        inputProps: { min: 0, step: "0.01", type: "number" },
    },
    {
        name: "max_early_days",
        type: "number",
        label: "Maximum Early Days *",
        colSpan: "col-span-12 md:col-span-4",
        inputProps: { min: 0, step: "0.01", type: "number" },
    },
    {
        name: "early_punishment_type",
        type: "select",
        label: "Early Punishment Type *",
        placeholder: "Select early punishment type",
        colSpan: "col-span-12 md:col-span-4",
        options: [
            { label: "Fixed Amount", value: "fixed" },
            { label: "Basic Salary (1 Day)", value: "basic" },
            { label: "Gross Salary (1 Day)", value: "gross" },
        ],
        handleChange: (e) => {
            form.setValue("early_punishment_type", e.value);

            if (e.value !== "fixed") {
                form.setValue("early_punishment_amount", null);
            }
        },
        rules: { required: "Punishment type is required" },
    },
    {
        name: "early_punishment_amount",
        type: "number",
        label: "Early Punishment Amount",
        colSpan: "col-span-12 md:col-span-4",
        visibility: form.watch("early_punishment_type") === "fixed",
        inputProps: { min: 0, step: "0.01", type: "number" },
    },
];

export default latePunishmentFields;
