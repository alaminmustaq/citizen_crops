import { useAppSelector } from "@/hooks/use-redux";

const fields = (form, actions) => {
    const { user } = useAppSelector((state) => state.auth);

    return [
        // =============== Salary Generation Scope ===============
        {
            name: "scope_type",
            type: "select",
            label: "Scope Type *",
            placeholder: "Select scope type",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Company wise salary", value: "company" },
                { label: "Project wise salary", value: "project" },
            ],
            handleChange: (e) => {
                form.setValue("scope_type", e.value);
                form.setValue("project_id", null);
                form.setValue("department_id", null);
            },
            rules: { required: "Scope type is required" },
        },

        // =============== Relations ===============
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            visibility:
                form.watch("scope_type") === "company" ||
                form.watch("scope_type") === "project",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select",
            firstChildren:
                user?.employee || form.watch("scope_type") === "project"
                    ? []
                    : [{ label: "All Branch", value: "all-branch" }],
            colSpan: "col-span-12 md:col-span-6",
            rules: { required: "Branch is required" },
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            visibility: form.watch("scope_type") === "company",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id", "scope_type"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project *",
            visibility: form.watch("scope_type") === "project",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
                ["branch_id", "scope_type"],
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                validate: (value, formValues) => {
                    if (formValues.scope_type === "project" && !value) {
                        return "Project is required for project wise salary generation";
                    }
                    return true;
                },
            },
        },

        // =============== Salary Details ===============
        {
            name: "salary_month",
            type: "month",
            label: "Salary Month *",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { type: "month" }, // controlled by RHF
            rules: { required: "Salary month is required" },
        },

        // =============== Status ===============
        // {
        //     name: "status",
        //     type: "select",
        //     label: "Status *",
        //     placeholder: "Select status",
        //     colSpan: "col-span-12 md:col-span-6",
        //     options: [
        //         { label: "Pending", value: "pending" },
        //         { label: "Approved", value: "approved" },
        //         { label: "Paid", value: "paid" },
        //     ],
        //     rules: { required: "Status is required" },
        // },

        // =============== Additional Details ===============
        {
            name: "notes",
            type: "textarea",
            label: "Notes",
            placeholder: "Optional notes for this salary record…",
            colSpan: "col-span-12",
        },
    ];
};

export default fields;
