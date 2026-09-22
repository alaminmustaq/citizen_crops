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

const fields = (form) => {
    return [
        // —— Input first ——
        {
            name: "bonus_name",
            type: "input",
            label: "Bonus Name",
            placeholder: "Enter bonus name",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { maxLength: 255 },
        },
        {
            name: "bonus_type_id",
            type: "async-select",
            label: "Bonus Type *",
            placeholder: "Select bonus type",
            colSpan: "col-span-12 md:col-span-6",
            loadOptions: [
                "bonus/bonus_type",
                "bonus_types",
                "leaveTypeSearchTemplate",
            ],
            rules: { required: "Bonus type is required" },
        },
        // —— Number inputs ——
        {
            name: "min_days",
            type: "number",
            label: "Min Days *",
            placeholder: "0",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, step: 1 },
            rules: { required: "Min days is required", min: { value: 0, message: "Min 0" } },
        },
        {
            name: "max_days",
            type: "number",
            label: "Max Days *",
            placeholder: "0",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, step: 1 },
            rules: { required: "Max days is required", min: { value: 0, message: "Min 0" } },
        },
        {
            name: "bonus_percentage",
            type: "number",
            label: "Bonus %",
            placeholder: "0",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, max: 100, step: "0.01" },
            disabled: (form) => {
                const amount = form.watch("amount");
                const num = Number(amount);
                return amount != null && amount !== "" && !Number.isNaN(num) && num > 0;
            },
            rules: {
                validate: (val) => {
                    const amt = form?.getValues?.("amount");
                    const pct = val;
                    const hasPct = pct != null && pct !== "" && !Number.isNaN(Number(pct));
                    const hasAmt = amt != null && amt !== "" && !Number.isNaN(Number(amt));
                    if (!hasPct && !hasAmt) return "Bonus % or Amount is required";
                    return true;
                },
            },
        },
        {
            name: "amount",
            type: "number",
            label: "Amount",
            placeholder: "0",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 0, step: "0.01" },
            disabled: (form) => {
                const pct = form.watch("bonus_percentage");
                const num = Number(pct);
                return pct != null && pct !== "" && !Number.isNaN(num) && num > 0;
            },
            rules: {
                min: { value: 0, message: "Min 0" },
                validate: (val) => {
                    const pct = form?.getValues?.("bonus_percentage");
                    const amt = val;
                    const hasAmt = amt != null && amt !== "" && !Number.isNaN(Number(amt));
                    const hasPct = pct != null && pct !== "" && !Number.isNaN(Number(pct));
                    if (!hasAmt && !hasPct) return "Bonus % or Amount is required";
                    return true;
                },
            },
        },
        {
            name: "year",
            type: "number",
            label: "Year *",
            placeholder: "e.g. 2026",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { min: 2000, max: 2100, step: 1 },
            rules: {
                required: "Year is required",
                min: { value: 2000, message: "Min 2000" },
                max: { value: 2100, message: "Max 2100" },
            },
        },
        // —— Company or Project wise ——
        {
            name: "company_project_wise",
            type: "select",
            label: "Company or Project wise *",
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Company wise", value: "company" },
                { label: "Project wise", value: "project" },
            ],
            handleChange: (e, form) => {
                if (!form) return;
                form.setValue("company_project_wise", e?.value);
                if (e?.value === "company") {
                    form.setValue("project_id", null);
                } else {
                    form.setValue("department_id", null);
                    form.setValue("job_position_id", null);
                }
            },
            rules: { required: "Company or Project wise is required" },
        },
        // —— Branch: visible for both Company wise and Project wise (branch-wise projects) ——
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            placeholder: "Select branch",
            colSpan: "col-span-12 md:col-span-6",
            visibility:
                form?.watch("company_project_wise") === "company" ||
                form?.watch("company_project_wise") === "project",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            rules: { required: "Branch is required" },
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department *",
            placeholder: "Select department",
            colSpan: "col-span-12 md:col-span-6",
            visibility: form?.watch("company_project_wise") === "company",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id"],
            ],
            rules: { required: "Department is required" },
        },
        {
            name: "job_position_id",
            type: "async-select",
            label: "Job Position *",
            placeholder: "Select job position",
            colSpan: "col-span-12 md:col-span-6",
            visibility: form?.watch("company_project_wise") === "company",
            loadOptions: [
                "organization/job-positions",
                "job_positions",
                "jobPositionsTemplate",
                ["branch_id", "department_id"],
            ],
            rules: { required: "Job position is required" },
        },
        // —— Project – visible when Project wise; options filtered by selected Branch ——
        {
            name: "project_id",
            type: "async-select",
            label: "Project *",
            placeholder: "Select branch first, then project",
            colSpan: "col-span-12 md:col-span-6",
            visibility: form?.watch("company_project_wise") === "project",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
                ["branch_id"],
            ],
            rules: { required: "Project is required" },
        },
        // —— Select (Month, Status) ——
        {
            name: "month",
            type: "select",
            label: "Month *",
            placeholder: "Select month",
            colSpan: "col-span-12 md:col-span-6",
            options: monthOptions,
            rules: { required: "Month is required" },
        },
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
    ];
};

export default fields;
